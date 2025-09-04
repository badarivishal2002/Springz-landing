"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import QuantitySelector from "./QuantitySelector"

interface CartDrawerProps {
  children?: React.ReactNode
}

// Mock cart data for demo purposes - Updated with INR prices
const mockCart = {
  items: [
    {
      id: "1",
      product: {
        name: "Elite Protein",
        images: ["/native-protein-powder.png"],
      },
      selectedFlavor: { name: "Chocolate" },
      selectedSize: { name: "900g" },
      price: 1999,
      quantity: 1,
    },
    {
      id: "2",
      product: {
        name: "Native Protein Classic",
        images: ["/placeholder-wsy0q.png"],
      },
      selectedFlavor: { name: "Vanilla" },
      selectedSize: { name: "1kg" },
      price: 2499,
      quantity: 2,
    },
  ],
  itemCount: 3,
  subtotal: 6997,
  shipping: 0,
  tax: 559.76,
  total: 7556.76,
}

// Currency formatter for INR
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const [cart, setCart] = useState(mockCart)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const tax = subtotal * 0.08 // 8% tax
      const shipping = subtotal > 2000 ? 0 : 150 // Free shipping over ₹2000
      const total = subtotal + tax + shipping
      
      return {
        ...prevCart,
        items: updatedItems,
        itemCount,
        subtotal,
        tax,
        shipping,
        total,
      }
    })
  }

  const removeItem = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId)
      
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const tax = subtotal * 0.08
      const shipping = subtotal > 2000 ? 0 : 150
      const total = subtotal + tax + shipping
      
      return {
        ...prevCart,
        items: updatedItems,
        itemCount,
        subtotal,
        tax,
        shipping,
        total,
      }
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-springz-green/10 hover:text-springz-green">
            <ShoppingCart className="h-5 w-5" />
            {cart.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-springz-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cart.itemCount}
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
              <span className="text-gray-900">Cart ({cart.itemCount})</span>
            </div>
            {cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                disabled={isLoading}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.items.length === 0 ? (
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
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.selectedFlavor.name} • {item.selectedSize.name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0 hover:bg-springz-green/10 hover:text-springz-green"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 hover:bg-springz-green/10 hover:text-springz-green"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatINR(item.price * item.quantity)}</p>
                          <p className="text-xs text-gray-500">{formatINR(item.price)} each</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
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
                    <span>{formatINR(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={cart.shipping === 0 ? "text-springz-green font-medium" : ""}>
                      {cart.shipping === 0 ? "FREE" : formatINR(cart.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatINR(cart.tax)}</span>
                  </div>
                  <Separator className="bg-springz-green/10" />
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>{formatINR(cart.total)}</span>
                  </div>
                </div>

                {cart.subtotal < 2000 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">
                      Add <strong>{formatINR(2000 - cart.subtotal)}</strong> more for free shipping!
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