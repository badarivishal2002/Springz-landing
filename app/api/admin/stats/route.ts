import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current date for period calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Basic counts and aggregations
    const [
      totalProducts,
      totalCategories,
      totalUsers,
      totalCustomers,
      totalOrders,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      ordersThisMonth,
      ordersLastMonth,
      newCustomersThisMonth,
      newCustomersLastMonth,
      averageOrderValue,
      topProducts,
      recentOrders,
      monthlyRevenue,
      productsByCategory,
      reviewStats
    ] = await Promise.all([
      // Basic counts
      prisma.product.count(),
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
          createdAt: { gte: startOfMonth }
        },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: { 
          paymentStatus: 'PAID',
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { total: true }
      }),
      
      // Order counts by period
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.order.count({
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Customer counts by period
      prisma.user.count({
        where: { 
          role: 'CUSTOMER',
          createdAt: { gte: startOfMonth }
        }
      }),
      prisma.user.count({
        where: { 
          role: 'CUSTOMER',
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Average order value
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _avg: { total: true }
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      }),
      
      // Monthly revenue for the year
      prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', createdAt) as month,
          SUM(total) as revenue,
          COUNT(*) as orders
        FROM "Order" 
        WHERE paymentStatus = 'PAID' 
          AND createdAt >= ${startOfYear.toISOString()}
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month
      `,
      
      // Products by category
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      
      // Review statistics
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true }
      })
    ])

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    // Process monthly revenue data
    const monthlyRevenueData = (monthlyRevenue as any[]).map(item => ({
      month: item.month,
      revenue: Number(item.revenue) || 0,
      orders: Number(item.orders) || 0
    }))

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true, images: true }
        })
        return {
          productId: item.productId,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          image: product?.images ? JSON.parse(product.images)[0] : null,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.productId || 0
        }
      })
    )

    // Prepare response data
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
        thisMonth: revenueThisMonth._sum.total || 0,
        lastMonth: revenueLastMonth._sum.total || 0,
        growth: calculateGrowth(
          revenueThisMonth._sum.total || 0,
          revenueLastMonth._sum.total || 0
        ),
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
        newThisMonth: newCustomersThisMonth,
        newLastMonth: newCustomersLastMonth,
        growth: calculateGrowth(newCustomersThisMonth, newCustomersLastMonth)
      },
      products: {
        total: totalProducts,
        byCategory: productsByCategory.map(cat => ({
          categoryId: cat.id,
          categoryName: cat.name,
          productCount: cat._count.products
        })),
        topSelling: topProductsWithDetails
      },
      reviews: {
        averageRating: Math.round((reviewStats._avg.rating || 0) * 10) / 10,
        totalReviews: reviewStats._count.rating || 0
      },
      charts: {
        monthlyRevenue: monthlyRevenueData
      },
      recentActivity: {
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.user.name,
          customerEmail: order.user.email,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          itemCount: order.items.length,
          createdAt: order.createdAt
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