# Dockerfile for Springz Landing - Optimized for GCP Cloud Run
# Multi-stage build for production optimization

# ================================
# Stage 1: Dependencies
# ================================
FROM node:18-alpine AS deps

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on available lock file
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile --prod; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ================================
# Stage 2: Builder
# ================================
FROM node:18-alpine AS builder

# Install dependencies needed for build
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy environment file for build (if exists)
COPY .env.example .env

# Generate Prisma client
RUN npx prisma generate

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Set Node environment
ENV NODE_ENV=production

# Build the application
RUN \
  if [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else npm run build; \
  fi

# ================================
# Stage 3: Runner (Production)
# ================================
FROM node:18-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create a startup script for Prisma migrations
COPY --chown=nextjs:nodejs <<EOF /app/start.sh
#!/bin/sh
set -e

echo "🚀 Starting Springz Landing Application..."

# Wait for database to be ready (optional)
if [ -n "\$DATABASE_URL" ]; then
  echo "⏳ Waiting for database connection..."
  npx prisma db push --accept-data-loss || echo "⚠️  Database push failed, continuing..."
fi

echo "🎯 Starting Next.js server on port \$PORT"
exec "\$@"
EOF

RUN chmod +x /app/start.sh

# Switch to non-root user
USER nextjs

# Expose port (GCP Cloud Run uses PORT env variable)
EXPOSE 8080

# Health check for GCP
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "/app/start.sh"]
CMD ["node", "server.js"]
