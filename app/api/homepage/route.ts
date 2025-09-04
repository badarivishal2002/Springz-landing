import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get featured products with all related data
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true
      },
      include: {
        category: true,
        sizes: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 8 // Limit to 8 featured products for homepage
    })

    // Get all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    // Process featured products to include calculated rating and parse JSON fields
    const processedFeaturedProducts = featuredProducts.map(product => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
      
      return {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: product._count.reviews,
        reviews: undefined, // Remove reviews data from response
        _count: undefined
      }
    })

    // Get basic stats for trust indicators
    const stats = await prisma.$transaction([
      prisma.product.count({ where: { inStock: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true }
      })
    ])

    const [productCount, customerCount, orderCount, reviewStats] = stats

    const response = {
      featuredProducts: processedFeaturedProducts,
      categories: categories,
      stats: {
        productsAvailable: productCount,
        happyCustomers: customerCount,
        ordersDelivered: orderCount,
        averageRating: Math.round((reviewStats._avg.rating || 0) * 10) / 10,
        totalReviews: reviewStats._count.rating
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    )
  }
}