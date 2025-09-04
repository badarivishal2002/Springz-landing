"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { cartApi, orderApi } from "@/lib/api"
import type { Cart, CheckoutForm } from "@/lib/types"

export default function CheckoutPageClient() {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const [formData, setFormData] = useState<CheckoutForm>({
    email: user?.email || "",
    shippingAddress: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    billingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    sameAsShipping: true,
    paymentMethod: {
      type: "card",
      last4: "",
      brand: "",
    },
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const currentCart = cartApi.getCart()
    setCart(currentCart)
  }

  const handleInputChange = (section: "shippingAddress" | "billingAddress", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await orderApi.createOrder(formData)

      if (response.success && response.data) {
        setOrderId(response.data.id)
        setOrderComplete(true)
      } else {
        setError(response.error || "Failed to process order")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }

    setIsLoading(false)
  }

  if (cart.items.length === 0 && !orderComplete) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🛒</span>
            </div>
            <div>
              <h1 className="font-playfair font-bold text-3xl text-foreground mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground">Add some products to your cart before checking out.</p>
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

  if (orderComplete) {
    return (
      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h1 className="font-playfair font-bold text-3xl text-foreground mb-4">Order Confirmed!</h1>
              <p className="text-muted-foreground text-lg">
                Thank you for your order. We've received your payment and will start processing your order shortly.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <p className="font-mono text-lg font-semibold">{orderId}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">Back to Home</Button>
                </Link>
              </div>
            </div>
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
            <h1 className="font-playfair font-bold text-3xl text-foreground">Checkout</h1>
            <p className="text-muted-foreground mt-2">Complete your order</p>
          </div>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={!!user}
                      placeholder="your@email.com"
                    />
                    {!user && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                          Sign in
                        </Link>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingFirstName">First Name</Label>
                      <Input
                        id="shippingFirstName"
                        value={formData.shippingAddress.firstName}
                        onChange={(e) => handleInputChange("shippingAddress", "firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingLastName">Last Name</Label>
                      <Input
                        id="shippingLastName"
                        value={formData.shippingAddress.lastName}
                        onChange={(e) => handleInputChange("shippingAddress", "lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shippingCompany">Company (Optional)</Label>
                    <Input
                      id="shippingCompany"
                      value={formData.shippingAddress.company}
                      onChange={(e) => handleInputChange("shippingAddress", "company", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress1">Address</Label>
                    <Input
                      id="shippingAddress1"
                      value={formData.shippingAddress.address1}
                      onChange={(e) => handleInputChange("shippingAddress", "address1", e.target.value)}
                      required
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress2">Apartment, suite, etc. (Optional)</Label>
                    <Input
                      id="shippingAddress2"
                      value={formData.shippingAddress.address2}
                      onChange={(e) => handleInputChange("shippingAddress", "address2", e.target.value)}
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange("shippingAddress", "city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleInputChange("shippingAddress", "state", e.target.value)}
                        required
                        placeholder="CA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingZip">ZIP Code</Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => handleInputChange("shippingAddress", "zipCode", e.target.value)}
                        required
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </span>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: { ...prev.paymentMethod, type: value as "card" | "paypal" | "apple_pay" },
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="flex items-center gap-2 cursor-not-allowed">
                        PayPal (Coming Soon)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="apple_pay" id="apple_pay" disabled />
                      <Label htmlFor="apple_pay" className="flex items-center gap-2 cursor-not-allowed">
                        Apple Pay (Coming Soon)
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod.type === "card" && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </span>
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, sameAsShipping: checked as boolean }))
                      }
                    />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!formData.sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingFirstName">First Name</Label>
                          <Input
                            id="billingFirstName"
                            value={formData.billingAddress.firstName}
                            onChange={(e) => handleInputChange("billingAddress", "firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingLastName">Last Name</Label>
                          <Input
                            id="billingLastName"
                            value={formData.billingAddress.lastName}
                            onChange={(e) => handleInputChange("billingAddress", "lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingAddress1">Address</Label>
                        <Input
                          id="billingAddress1"
                          value={formData.billingAddress.address1}
                          onChange={(e) => handleInputChange("billingAddress", "address1", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billingCity">City</Label>
                          <Input
                            id="billingCity"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleInputChange("billingAddress", "city", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingState">State</Label>
                          <Input
                            id="billingState"
                            value={formData.billingAddress.state}
                            onChange={(e) => handleInputChange("billingAddress", "state", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingZip">ZIP Code</Label>
                          <Input
                            id="billingZip"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => handleInputChange("billingAddress", "zipCode", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedFlavor.name} • {item.selectedSize.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
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
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping over $75</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Processing..." : `Complete Order - $${cart.total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
