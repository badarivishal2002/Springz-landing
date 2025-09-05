import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().nullable(),
  phone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).nullable(),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
})

// GET /api/admin/users/[id] - Get user details (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
      where: { userId: params.id },
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
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user details (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    const validatedData = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      phone: validatedData.phone,
      gender: validatedData.gender,
    }

    // Handle date of birth
    if (validatedData.dateOfBirth) {
      updateData.dateOfBirth = new Date(validatedData.dateOfBirth)
    } else {
      updateData.dateOfBirth = null
    }

    // Handle role update
    if (validatedData.role && validatedData.role !== existingUser.role) {
      updateData.role = validatedData.role
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
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
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    // Prevent admin from deleting themselves
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (this will cascade to related records)
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
