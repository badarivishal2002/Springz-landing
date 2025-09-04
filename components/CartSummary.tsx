"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Truck } from "lucide-react"
import type { Cart } from "@/lib/types"

interface CartSummaryProps {
  cart: Cart
  showCheckoutButton?: boolean
  onCheckout?: () => void
}

export default function CartSummary({ cart, showCheckoutButton = true, onCheckout }: CartSummaryProps) {
  const freeShippingThreshold = 75
  const remainingForFreeShipping = freeShippingThreshold - cart.subtotal

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cart.itemCount} items)</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? "FREE" : `$${cart.shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${cart.tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>

        {remainingForFreeShipping > 0 && (
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>
                Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for FREE
                shipping!
              </span>
            </div>
          </div>
        )}

        {cart.shipping === 0 && cart.subtotal >= freeShippingThreshold && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Truck className="h-4 w-4" />
              <span className="font-medium">You qualify for FREE shipping!</span>
            </div>
          </div>
        )}

        {showCheckoutButton && (
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            onClick={onCheckout}
            disabled={cart.items.length === 0}
          >
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
