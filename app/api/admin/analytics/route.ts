import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '12months'

    // Calculate date ranges
    const now = new Date()
    let startDate: Date
    let endDate = now

    switch (range) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default: // 12months
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    }

    // Previous period for growth calculations
    const periodLength = endDate.getTime() - startDate.getTime()
    const previousStartDate = new Date(startDate.getTime() - periodLength)
    const previousEndDate = startDate

    // Execute all queries concurrently
    const [
      currentPeriodOrders,
      previousPeriodOrders,
      currentPeriodRevenue,
      previousPeriodRevenue,
      currentPeriodCustomers,
      previousPeriodCustomers,
      totalProducts,
      productSales,
      recentOrdersData,
      customerStats
    ] = await Promise.all([
      // Current period orders
      prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      
      // Previous period orders
      prisma.order.count({
        where: {
          createdAt: { gte: previousStartDate, lte: previousEndDate }
        }
      }),

      // Current period revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { total: true }
      }),

      // Previous period revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: previousStartDate, lte: previousEndDate }
        },
        _sum: { total: true }
      }),

      // Current period customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startDate, lte: endDate }
        }
      }),

      // Previous period customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: previousStartDate, lte: previousEndDate }
        }
      }),

      // Total products
      prisma.product.count({ where: { inStock: true } }),

      // Product sales data
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { 
          quantity: true,
          price: true
        },
        _count: { id: true },
        orderBy: { _sum: { price: 'desc' } },
        take: 10
      }),

      // Recent orders for daily chart
      prisma.order.findMany({
        where: {
          createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        },
        select: {
          createdAt: true,
          total: true,
          paymentStatus: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Customer statistics
      prisma.$transaction([
        prisma.user.count({
          where: { 
            role: 'CUSTOMER',
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        prisma.user.count({
          where: { 
            role: 'CUSTOMER',
            orders: { some: { createdAt: { gte: startDate, lte: endDate } } }
          }
        }),
        prisma.order.aggregate({
          where: { 
            paymentStatus: 'PAID',
            createdAt: { gte: startDate, lte: endDate }
          },
          _avg: { total: true }
        })
      ])
    ])

    // Get product details for sales data
    const productDetails = await Promise.all(
      productSales.map(async (sale) => {
        const product = await prisma.product.findUnique({
          where: { id: sale.productId },
          select: { name: true }
        })
        return {
          name: product?.name || 'Unknown Product',
          sales: sale._sum.price || 0,
          orders: sale._count.id,
          quantity: sale._sum.quantity || 0
        }
      })
    )

    // Calculate totals and growth
    const totalRevenue = currentPeriodRevenue._sum.total || 0
    const previousRevenue = previousPeriodRevenue._sum.total || 0
    const revenueGrowth = previousRevenue > 0 
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100)
      : totalRevenue > 0 ? 100 : 0

    const orderGrowth = previousPeriodOrders > 0 
      ? Math.round(((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100)
      : currentPeriodOrders > 0 ? 100 : 0

    const customerGrowth = previousPeriodCustomers > 0 
      ? Math.round(((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100)
      : currentPeriodCustomers > 0 ? 100 : 0

    // Process recent orders for daily chart
    const dailyOrdersMap = new Map()
    recentOrdersData.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!dailyOrdersMap.has(date)) {
        dailyOrdersMap.set(date, { orders: 0, revenue: 0 })
      }
      const dayData = dailyOrdersMap.get(date)
      dayData.orders += 1
      if (order.paymentStatus === 'PAID') {
        dayData.revenue += order.total
      }
    })

    const recentOrders = Array.from(dailyOrdersMap.entries())
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7) // Last 7 days

    // Calculate product performance percentages
    const totalProductSales = productDetails.reduce((sum, product) => sum + product.sales, 0)
    const productPerformance = productDetails.map(product => ({
      ...product,
      percentage: totalProductSales > 0 
        ? Math.round((product.sales / totalProductSales) * 100)
        : 0
    }))

    // Generate monthly sales data for trend chart
    const salesData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (range === '12months') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        date.setDate(1)
        
        const nextMonth = new Date(date)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        
        const monthOrders = await prisma.order.count({
          where: {
            createdAt: { gte: date, lt: nextMonth }
          }
        })
        
        const monthRevenue = await prisma.order.aggregate({
          where: {
            paymentStatus: 'PAID',
            createdAt: { gte: date, lt: nextMonth }
          },
          _sum: { total: true }
        })
        
        const monthCustomers = await prisma.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: { gte: date, lt: nextMonth }
          }
        })
        
        salesData.push({
          month: monthNames[date.getMonth()],
          sales: monthRevenue._sum.total || 0,
          orders: monthOrders,
          customers: monthCustomers
        })
      }
    }

    const [newCustomers, returningCustomers, avgOrderValue] = customerStats
    const conversionRate = currentPeriodCustomers > 0 
      ? (currentPeriodOrders / currentPeriodCustomers) * 100
      : 0

    const analyticsData = {
      overview: {
        totalRevenue,
        totalOrders: currentPeriodOrders,
        totalCustomers: await prisma.user.count({ where: { role: 'CUSTOMER' } }),
        totalProducts
      },
      trends: {
        revenueGrowth,
        orderGrowth,
        customerGrowth
      },
      salesData,
      productPerformance,
      recentOrders,
      customerStats: {
        newCustomers,
        returningCustomers,
        averageOrderValue: avgOrderValue._avg.total || 0,
        conversionRate: Math.round(conversionRate * 10) / 10
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
