import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Admin authentication removed - allow direct access to admin routes
  // All admin routes are now accessible without authentication
  
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
