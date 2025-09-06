#!/bin/bash

# 🚀 Springz Nutrition - Quick Setup Script
# This script will help you set up the project quickly

echo "🌱 Welcome to Springz Nutrition Setup!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional required packages
echo "📦 Installing additional packages..."
npm install next-auth @auth/prisma-adapter prisma @prisma/client bcryptjs @types/bcryptjs cloudinary multer @types/multer react-hook-form @hookform/resolvers zod react-dropzone @radix-ui/react-toast @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-dialog tsx

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.env.local
    echo "✅ Environment file created"
    echo "⚠️  Please update .env.local with your actual configuration"
else
    echo "⚠️  .env.local already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Setup database
echo "🗃️  Setting up database..."
read -p "Do you want to push the database schema? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo "✅ Database schema applied"
    
    # Seed database
    read -p "Do you want to seed the database with sample data? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx prisma db seed
        echo "✅ Database seeded with sample data"
    fi
fi

# Setup complete
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual configuration"
echo "2. Set up your database (PostgreSQL recommended)"
echo "3. Configure Cloudinary for image uploads"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - IMPLEMENTATION_GUIDE.md"
echo "   - FEATURES_SUMMARY.md"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email: admin@springz.com"
echo "   Password: admin123"
echo ""
echo "🚀 Ready to launch!"
