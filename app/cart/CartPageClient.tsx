"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash2, Plus, Minus, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatINR } from "@/lib/currency"

interface CartItem {
  id: string
  quantity: number
  size: string | null
  product: {
    id: string
    name: string
    slug: string
    price: number
    originalPrice?: number
    images: string[]
    inStock: boolean
    category: {
      name: string
    }
  }
  subtotal: number
}

interface CartSummary {
  itemCount: number
  subtotal: number
  shippingCost: number
  shippingThreshold: number
  tax: number
  taxRate: number
  total: number
}

interface Cart {
  items: CartItem[]
  summary: CartSummary
}

export default function CartPageClient() {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      setLoading(false)
      return
    }

    loadCart()
  }, [session, status])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to load cart')
      }
      
      const cartData = await response.json()
      setCart(cartData)
    } catch (error) {
      console.error('Error loading cart:', error)
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setUpdating(cartItemId)
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }

      // Reload cart after update
      await loadCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      setUpdating(cartItemId)
      
      const response = await fetch(`/api/cart?itemId=${cartItemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove item')
      }

      // Reload cart after removal
      await loadCart()
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  // Handle unauthenticated state
  if (status === 'loading') {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🔐</span>
            </div>
            <div>
              <h1 className="font-bold text-3xl text-gray-900 mb-4">Sign in to view your cart</h1>
              <p className="text-gray-600">
                You need to be signed in to access your shopping cart.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button className="bg-springz-green hover:bg-springz-green/90">
                  Sign In
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadCart}>Try Again</Button>
        </div>
      </main>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🛒</span>
            </div>
            <div>
              <h1 className="font-bold text-3xl text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600">
                Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
              </p>
            </div>
            <Link href="/shop">
              <Button className="bg-springz-green hover:bg-springz-green/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-3xl text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{cart.summary.itemCount} items in your cart</p>
          </div>
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4 p-4">
                      <Link href={`/product/${item.product.slug}`}>
                        <img
                          src={item.product.images[0] || "/placeholder-wsy0q.png"}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                        />
                      </Link>

                      <div className="flex-1 space-y-3">
                        <div>
                          <Link href={`/product/${item.product.slug}`}>
                            <h3 className="font-semibold text-lg hover:text-springz-green cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600">
                            {item.product.category.name} {item.size && `• ${item.size}`}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updating === item.id || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-lg w-8 text-center">
                              {updating === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatINR(item.subtotal)}</p>
                            <p className="text-sm text-gray-600">{formatINR(item.product.price)} each</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="text-gray-500 hover:text-red-600"
                      >
                        {updating === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {index < cart.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.summary.itemCount} items)</span>
                  <span>{formatINR(cart.summary.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {cart.summary.shippingCost === 0 ? (
                      <span className="text-springz-green font-medium">FREE</span>
                    ) : (
                      formatINR(cart.summary.shippingCost)
                    )}
                  </span>
                </div>

                {cart.summary.shippingCost > 0 && (
                  <p className="text-sm text-gray-600">
                    Add {formatINR(cart.summary.shippingThreshold - cart.summary.subtotal)} more for free shipping
                  </p>
                )}

                <div className="flex justify-between">
                  <span>Tax (GST {Math.round(cart.summary.taxRate * 100)}%)</span>
                  <span>{formatINR(cart.summary.tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatINR(cart.summary.total)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-springz-green hover:bg-springz-green/90 text-white font-medium py-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center text-sm text-gray-600">
                  <p>Secure checkout with SSL encryption</p>
                  <p className="mt-1">Free shipping on orders over {formatINR(cart.summary.shippingThreshold)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}