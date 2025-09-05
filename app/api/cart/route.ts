import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's cart items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            category: true,
            sizes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Process cart items to include calculated data
    const processedCartItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        images: item.product.images ? JSON.parse(item.product.images) : [],
        inStock: item.product.inStock,
        category: item.product.category,
        sizes: item.product.sizes
      },
      subtotal: item.quantity * item.product.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }))

    // Calculate cart totals
    const subtotal = processedCartItems.reduce((total, item) => total + item.subtotal, 0)
    const itemCount = processedCartItems.reduce((count, item) => count + item.quantity, 0)
    
    // Calculate shipping (free shipping over ₹2000)
    const shippingThreshold = 2000
    const shippingCost = subtotal >= shippingThreshold ? 0 : 99
    
    // Calculate tax (18% GST)
    const taxRate = 0.18
    const tax = Math.round(subtotal * taxRate)
    
    const total = subtotal + shippingCost + tax

    return NextResponse.json({
      items: processedCartItems,
      summary: {
        itemCount,
        subtotal,
        shippingCost,
        shippingThreshold,
        tax,
        taxRate,
        total
      }
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1, size = null } = body

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      )
    }

    // Verify product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        sizes: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      )
    }

    // Handle size: use first available size if none provided
    let finalSize = size
    if (!finalSize && product.sizes && product.sizes.length > 0) {
      finalSize = product.sizes[0].size
    }
    // If still no size, use default
    if (!finalSize) {
      finalSize = 'Default'
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size: {
          userId: session.user.id,
          productId: productId,
          size: finalSize
        }
      }
    })

    let cartItem

    if (existingCartItem) {
      // Update quantity of existing item
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
          size: finalSize
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    }

    // Process the cart item for response
    const processedCartItem = {
      id: cartItem.id,
      quantity: cartItem.quantity,
      size: cartItem.size,
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        slug: cartItem.product.slug,
        price: cartItem.product.price,
        originalPrice: cartItem.product.originalPrice,
        images: cartItem.product.images ? JSON.parse(cartItem.product.images) : [],
        inStock: cartItem.product.inStock,
        category: cartItem.product.category
      },
      subtotal: cartItem.quantity * cartItem.product.price,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt
    }

    return NextResponse.json({
      message: 'Item added to cart successfully',
      item: processedCartItem
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItemId, quantity } = body

    if (!cartItemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid cart item ID or quantity' },
        { status: 400 }
      )
    }

    // Verify cart item belongs to the user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    })

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      })

      return NextResponse.json({
        message: 'Item removed from cart'
      })
    } else {
      // Update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })

      const processedCartItem = {
        id: updatedCartItem.id,
        quantity: updatedCartItem.quantity,
        size: updatedCartItem.size,
        product: {
          id: updatedCartItem.product.id,
          name: updatedCartItem.product.name,
          slug: updatedCartItem.product.slug,
          price: updatedCartItem.product.price,
          originalPrice: updatedCartItem.product.originalPrice,
          images: updatedCartItem.product.images ? JSON.parse(updatedCartItem.product.images) : [],
          inStock: updatedCartItem.product.inStock,
          category: updatedCartItem.product.category
        },
        subtotal: updatedCartItem.quantity * updatedCartItem.product.price,
        createdAt: updatedCartItem.createdAt,
        updatedAt: updatedCartItem.updatedAt
      }

      return NextResponse.json({
        message: 'Cart item updated successfully',
        item: processedCartItem
      })
    }
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('itemId')

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    // Verify cart item belongs to the user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    })

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({
      message: 'Item removed from cart successfully'
    })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
