"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import QuantitySelector from "@/components/QuantitySelector"
import CartSummary from "@/components/CartSummary"
import { cartApi } from "@/lib/api"
import type { Cart } from "@/lib/types"

export default function CartPageClient() {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const currentCart = cartApi.getCart()
    setCart(currentCart)
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true)
    const response = await cartApi.updateQuantity(itemId, quantity)
    if (response.success && response.data) {
      setCart(response.data)
    }
    setIsLoading(false)
  }

  const removeItem = async (itemId: string) => {
    setIsLoading(true)
    const response = await cartApi.removeItem(itemId)
    if (response.success && response.data) {
      setCart(response.data)
    }
    setIsLoading(false)
  }

  const clearCart = async () => {
    setIsLoading(true)
    const response = await cartApi.clearCart()
    if (response.success && response.data) {
      setCart(response.data)
    }
    setIsLoading(false)
  }

  if (cart.items.length === 0) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🛒</span>
            </div>
            <div>
              <h1 className="font-playfair font-bold text-3xl text-foreground mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
              </p>
            </div>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
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
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair font-bold text-3xl text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">{cart.itemCount} items in your cart</p>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4 p-4">
                      <Link href={`/product/${item.product.slug}`}>
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-75"
                        />
                      </Link>

                      <div className="flex-1 space-y-3">
                        <div>
                          <Link href={`/product/${item.product.slug}`}>
                            <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground">
                            {item.selectedFlavor.name} • {item.selectedSize.name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                            disabled={isLoading}
                          />

                          <div className="text-right">
                            <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">${item.price} each</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
            <CartSummary cart={cart} onCheckout={() => (window.location.href = "/checkout")} />
          </div>
        </div>
      </div>
    </main>
  )
}
