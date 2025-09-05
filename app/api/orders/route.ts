import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/orders - Get current user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
