import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  servingSize: z.string().min(1, 'Serving size is required'),
  protein: z.string().min(1, 'Protein is required'),
  calories: z.string().min(1, 'Calories is required'),
  fats: z.string().min(1, 'Fats is required'),
  carbs: z.string().min(1, 'Carbs is required'),
  sugar: z.string().min(1, 'Sugar is required'),
  ingredients: z.string().min(1, 'Ingredients are required'),
  tags: z.array(z.string()),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  sizes: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    available: z.boolean().default(true)
  })).optional(),
  features: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    description: z.string()
  })).optional(),
  nutritionFacts: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  howToUse: z.array(z.object({
    step: z.number(),
    instruction: z.string()
  })).optional(),
  sciencePoints: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
})

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (inStock === 'true') {
      where.inStock = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
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
          select: {
            rating: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

      // Parse JSON fields for SQLite
      const productsWithParsed = products.map(product => {
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

      return NextResponse.json(productsWithParsed)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    // Create product with related data
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        categoryId: validatedData.categoryId,
        images: JSON.stringify(validatedData.images),
        servingSize: validatedData.servingSize,
        protein: validatedData.protein,
        calories: validatedData.calories,
        fats: validatedData.fats,
        carbs: validatedData.carbs,
        sugar: validatedData.sugar,
        ingredients: validatedData.ingredients,
        tags: JSON.stringify(validatedData.tags),
        inStock: validatedData.inStock,
        featured: validatedData.featured,
        sizes: validatedData.sizes ? {
          create: validatedData.sizes
        } : undefined,
        features: validatedData.features ? {
          create: validatedData.features
        } : undefined,
        nutritionFacts: validatedData.nutritionFacts ? {
          create: validatedData.nutritionFacts
        } : undefined,
        howToUse: validatedData.howToUse ? {
          create: validatedData.howToUse
        } : undefined,
        sciencePoints: validatedData.sciencePoints ? {
          create: validatedData.sciencePoints.map(point => ({ point }))
        } : undefined,
        faqs: validatedData.faqs ? {
          create: validatedData.faqs
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
