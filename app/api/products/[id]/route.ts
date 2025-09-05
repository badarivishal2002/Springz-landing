import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if id is a slug or actual id
    // Prisma CUID format: starts with 'c' and is 25 characters long
    // Slugs are typically shorter and contain hyphens
    const isSlug = params.id.includes('-') || params.id.length < 20
    
    console.log('API Route - Received ID:', params.id)
    console.log('API Route - Treating as:', isSlug ? 'slug' : 'id')
    
    const product = await prisma.product.findUnique({
      where: isSlug ? { slug: params.id } : { id: params.id },
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

    console.log('API Route - Product found:', !!product)

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

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    
    console.log('PUT - Updating product ID:', params.id)
    console.log('PUT - Update data:', body)
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        sizes: true,
        features: true,
        nutritionFacts: true,
        howToUse: true,
        sciencePoints: true,
        faqs: true,
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product with transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.productSize.deleteMany({ where: { productId: params.id } })
      await tx.productFeature.deleteMany({ where: { productId: params.id } })
      await tx.nutritionFact.deleteMany({ where: { productId: params.id } })
      await tx.howToUse.deleteMany({ where: { productId: params.id } })
      await tx.sciencePoint.deleteMany({ where: { productId: params.id } })
      await tx.productFAQ.deleteMany({ where: { productId: params.id } })

      // Update main product
      return await tx.product.update({
        where: { id: params.id },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          shortDescription: body.shortDescription,
          price: body.price,
          originalPrice: body.originalPrice,
          categoryId: body.categoryId,
          images: body.images ? JSON.stringify(body.images) : undefined,
          servingSize: body.servingSize,
          protein: body.protein,
          calories: body.calories,
          fats: body.fats,
          carbs: body.carbs,
          sugar: body.sugar,
          ingredients: body.ingredients,
          tags: body.tags ? JSON.stringify(body.tags) : undefined,
          inStock: body.inStock,
          featured: body.featured,
          sizes: body.sizes ? {
            create: body.sizes
          } : undefined,
          features: body.features ? {
            create: body.features
          } : undefined,
          nutritionFacts: body.nutritionFacts ? {
            create: body.nutritionFacts
          } : undefined,
          howToUse: body.howToUse ? {
            create: body.howToUse
          } : undefined,
          sciencePoints: body.sciencePoints ? {
            create: body.sciencePoints.map((point: string) => ({ point }))
          } : undefined,
          faqs: body.faqs ? {
            create: body.faqs
          } : undefined,
        },
        include: {
          category: true,
          sizes: true,
          features: true,
          nutritionFacts: true,
          howToUse: true,
          sciencePoints: true,
          faqs: true,
        }
      })
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    console.log('DELETE - Deleting product ID:', params.id)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product (cascading deletes will handle related records)
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Authentication') || error.message.includes('Admin'))) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Admin') ? 403 : 401 }
      )
    }

    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
