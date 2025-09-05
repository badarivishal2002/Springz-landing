import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current date for monthly calculations
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Execute all queries concurrently for better performance
    const [
      totalProducts,
      totalCategories,
      totalUsers,
      totalCustomers,
      totalOrders,
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthCustomers,
      lastMonthCustomers,
      productsByCategory,
      topSellingProducts,
      reviewStats,
      recentOrders,
      averageOrderValue
    ] = await Promise.all([
      // Basic counts
      prisma.product.count({ where: { inStock: true } }),
      prisma.category.count(),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      
      // Revenue calculations
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: { 
          paymentStatus: 'PAID',
          createdAt: { gte: startOfThisMonth }
        },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: { 
          paymentStatus: 'PAID',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { total: true }
      }),

      // Order counts by month
      prisma.order.count({
        where: { createdAt: { gte: startOfThisMonth } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
      }),

      // Customer counts by month
      prisma.user.count({
        where: { 
          role: 'CUSTOMER',
          createdAt: { gte: startOfThisMonth }
        }
      }),
      prisma.user.count({
        where: { 
          role: 'CUSTOMER',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
      }),

      // Products by category
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),

      // Top selling products (based on order items)
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),

      // Review statistics
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: { id: true }
      }),

      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          _count: {
            select: { items: true }
          }
        }
      }),

      // Average order value
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _avg: { total: true }
      })
    ])

    // Get product details for top selling products
    const topSellingProductDetails = await Promise.all(
      topSellingProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        })
        
        return {
          productId: item.productId,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          image: product?.images ? JSON.parse(product.images)[0] : null,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.id || 0
        }
      })
    )

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const revenueThisMonth = thisMonthRevenue._sum.total || 0
    const revenueLastMonth = lastMonthRevenue._sum.total || 0
    const ordersThisMonth = thisMonthOrders
    const ordersLastMonth = lastMonthOrders
    const customersThisMonth = thisMonthCustomers
    const customersLastMonth = lastMonthCustomers

    // Format response data
    const stats = {
      overview: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalCustomers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0
      },
      revenue: {
        total: totalRevenue._sum.total || 0,
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: calculateGrowth(revenueThisMonth, revenueLastMonth),
        averageOrderValue: averageOrderValue._avg.total || 0
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        lastMonth: ordersLastMonth,
        growth: calculateGrowth(ordersThisMonth, ordersLastMonth)
      },
      customers: {
        total: totalCustomers,
        newThisMonth: customersThisMonth,
        newLastMonth: customersLastMonth,
        growth: calculateGrowth(customersThisMonth, customersLastMonth)
      },
      products: {
        total: totalProducts,
        byCategory: productsByCategory.map(category => ({
          categoryId: category.id,
          categoryName: category.name,
          productCount: category._count.products
        })),
        topSelling: topSellingProductDetails
      },
      reviews: {
        averageRating: Math.round((reviewStats._avg.rating || 0) * 10) / 10,
        totalReviews: reviewStats._count.id || 0
      },
      recentActivity: {
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.user.name || 'Unknown Customer',
          customerEmail: order.user.email,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          itemCount: order._count.items,
          createdAt: order.createdAt.toISOString()
        }))
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
}
