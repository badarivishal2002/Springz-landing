"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatINR } from "@/lib/currency"

interface CartDrawerProps {
  children?: React.ReactNode
}

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

export default function CartDrawer({ children }: CartDrawerProps) {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  // Load cart when drawer opens or session changes
  useEffect(() => {
    if (isOpen && session) {
      loadCart()
    }
  }, [isOpen, session])

  const loadCart = async () => {
    if (!session) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to load cart')
      }
      
      const cartData = await response.json()
      setCart(cartData)
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!session || quantity < 1) return

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
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (cartItemId: string) => {
    if (!session) return

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
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    if (!session || !cart) return

    try {
      setIsLoading(true)
      
      // Remove all items one by one
      for (const item of cart.items) {
        await fetch(`/api/cart?itemId=${item.id}`, {
          method: 'DELETE',
        })
      }

      // Reload cart
      await loadCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated, show login prompt
  if (status === 'unauthenticated') {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-springz-green/10 hover:text-springz-green">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg bg-white">
          <SheetHeader className="border-b border-springz-green/10 pb-4">
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-springz-green" />
              <span className="text-gray-900">Cart</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full items-center justify-center text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-springz-cream rounded-2xl flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-springz-green" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-gray-900">Sign in to view cart</h3>
              <p className="text-gray-600">Create an account or sign in to save your items</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link href="/auth/signin">
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-springz-green hover:bg-springz-green/90 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/shop">
                <Button 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full border-springz-green text-springz-green hover:bg-springz-green/10"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-springz-green/10 hover:text-springz-green">
            <ShoppingCart className="h-5 w-5" />
            {cart?.summary.itemCount && cart.summary.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-springz-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cart.summary.itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg bg-white">
        <SheetHeader className="border-b border-springz-green/10 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-springz-green" />
              <span className="text-gray-900">
                Cart {cart?.summary.itemCount ? `(${cart.summary.itemCount})` : ''}
              </span>
            </div>
            {cart?.items.length && cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                disabled={isLoading}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Clear All'}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {isLoading && !cart ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto" />
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            </div>
          ) : !cart?.items.length || cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-springz-cream rounded-2xl flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-springz-green" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-gray-900">Your cart is empty</h3>
                <p className="text-gray-600">Add some premium protein products to get started</p>
              </div>
              <Link href="/shop">
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-springz-green hover:bg-springz-green/90 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Shop Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-springz-cream rounded-xl border border-springz-green/10">
                    <div className="w-16 h-16 bg-white rounded-lg p-2">
                      <img
                        src={item.product.images[0] || "/placeholder-wsy0q.png"}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.product.category.name} {item.size && `• ${item.size}`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                            className="w-8 h-8 p-0 hover:bg-springz-green/10 hover:text-springz-green"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-gray-900 w-8 text-center">
                            {updating === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="w-8 h-8 p-0 hover:bg-springz-green/10 hover:text-springz-green"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatINR(item.subtotal)}</p>
                          <p className="text-xs text-gray-500">{formatINR(item.product.price)} each</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      {updating === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="bg-springz-green/10" />

              {/* Cart Summary */}
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatINR(cart.summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={cart.summary.shippingCost === 0 ? "text-springz-green font-medium" : ""}>
                      {cart.summary.shippingCost === 0 ? "FREE" : formatINR(cart.summary.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST {Math.round(cart.summary.taxRate * 100)}%)</span>
                    <span>{formatINR(cart.summary.tax)}</span>
                  </div>
                  <Separator className="bg-springz-green/10" />
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>{formatINR(cart.summary.total)}</span>
                  </div>
                </div>

                {cart.summary.shippingCost > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">
                      Add <strong>{formatINR(cart.summary.shippingThreshold - cart.summary.subtotal)}</strong> more for free shipping!
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Link href="/cart">
                    <Button 
                      variant="outline" 
                      className="w-full border-springz-green text-springz-green hover:bg-springz-green/10" 
                      onClick={() => setIsOpen(false)}
                    >
                      View Full Cart
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button 
                      className="w-full bg-springz-green hover:bg-springz-green/90 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all" 
                      onClick={() => setIsOpen(false)}
                    >
                      Secure Checkout
                    </Button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-springz-green/10">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Secure</div>
                    <div className="text-xs font-semibold text-springz-green">Checkout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">30-day</div>
                    <div className="text-xs font-semibold text-springz-green">Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">FSSAI</div>
                    <div className="text-xs font-semibold text-springz-green">Certified</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}