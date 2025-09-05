import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function requireAdmin(request?: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  if (session.user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
  
  return session
}

export async function requireAuth(request?: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  return session
}
