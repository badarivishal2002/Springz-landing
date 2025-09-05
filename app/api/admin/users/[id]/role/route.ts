import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const roleChangeSchema = z.object({
  role: z.enum(['ADMIN', 'CUSTOMER'], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either ADMIN or CUSTOMER"
  }),
})

// PUT /api/admin/users/[id]/role - Change user role (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    
    const { role } = roleChangeSchema.parse(body)

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent changing own role
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 400 }
      )
    }

    // Check if role is already the same
    if (targetUser.role === role) {
      return NextResponse.json(
        { error: `User is already ${role.toLowerCase()}` },
        { status: 400 }
      )
    }

    // Special validation for admin creation
    if (role === 'ADMIN') {
      // Count current admins
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })

      // Log the admin transfer for security
      console.log(`Admin role transfer: ${session.user.email} is making ${targetUser.email} an admin. Current admin count: ${adminCount}`)
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    // Log the successful role change
    console.log(`Role change successful: ${targetUser.email} is now ${role} (changed by ${session.user.email})`)

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user: updatedUser
    })
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid role specified', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error changing user role:', error)
    return NextResponse.json(
      { error: 'Failed to change user role' },
      { status: 500 }
    )
  }
}
