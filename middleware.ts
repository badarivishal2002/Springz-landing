import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token to check authentication status
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Allow access to auth pages regardless of authentication status
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), request.url)
      )
    }
    
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*'
  ]
}
