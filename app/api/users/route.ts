import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
