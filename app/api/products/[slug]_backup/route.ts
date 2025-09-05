import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        sizes: true,
        features: true,
        nutritionFacts: true,
        howToUse: {
          orderBy: { step: 'asc' }
        },
        sciencePoints: true,
        faqs: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { reviews: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0

    const productWithCalculated = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count.reviews,
      _count: undefined
    }

    return NextResponse.json(productWithCalculated)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
