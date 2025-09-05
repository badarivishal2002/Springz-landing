import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).nullable(),
})

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const userWithOrders = {
      ...user,
      recentOrders
    }

    return NextResponse.json(userWithOrders)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/users/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    
    const validatedData = updateProfileSchema.parse(body)

    // Convert empty strings to null for optional fields
    const updateData = {
      name: validatedData.name,
      phone: validatedData.phone || null,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
      gender: validatedData.gender || null,
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
