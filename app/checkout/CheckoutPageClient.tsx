"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Loader2, 
  Shield, 
  RotateCcw, 
  Award,
  Check,
  Plus,
  Minus,
  X
} from "lucide-react"
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

interface Cart {
  items: CartItem[]
  summary: {
    itemCount: number
    subtotal: number
    shippingCost: number
    shippingThreshold: number
    tax: number
    taxRate: number
    total: number
  }
}

const steps = [
  { id: 'cart', label: 'Cart', completed: true },
  { id: 'information', label: 'Information', completed: false },
  { id: 'address', label: 'Address', completed: false },
  { id: 'delivery', label: 'Delivery', completed: false },
  { id: 'payment', label: 'Payment', completed: false }
]

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
]

export default function CheckoutPageClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    pin: "",
    fullName: "",
    whatsappOptIn: false,
    address1: "",
    address2: "",
    landmark: "",
    city: "",
    state: "",
    billingAddressSame: true,
    deliveryMethod: "standard",
    paymentMethod: "card"
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/checkout'))
      return
    }

    // Pre-fill user data if available
    setFormData(prev => ({
      ...prev,
      email: session.user?.email || "",
      fullName: session.user?.name || ""
    }))

    loadCart()
  }, [session, status, router])

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
    if (!cart) return

    try {
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

      await loadCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${cartItemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove item')
      }

      await loadCart()
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const applyCoupon = () => {
    // Mock coupon logic
    const validCoupons = {
      'SAVE10': 10,
      'FIRST20': 20,
      'WELCOME15': 15
    }

    if (validCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: validCoupons[couponCode.toUpperCase()]
      })
      setCouponCode("")
    } else {
      alert("Invalid coupon code")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty")
      return
    }

    // Basic validation
    if (!formData.email || !formData.pin || !formData.fullName || !formData.address1 || !formData.city || !formData.state) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Mock order creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and redirect to success page
      router.push('/checkout/success?order=' + Math.random().toString(36).substring(2, 15))
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Failed to process order')
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  if (error) {
    return (
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <p className="text-gray-600">Add some products to your cart before checking out.</p>
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

  const subtotalWithCoupon = cart.summary.subtotal - (appliedCoupon ? (cart.summary.subtotal * appliedCoupon.discount / 100) : 0)
  const finalTotal = subtotalWithCoupon + cart.summary.shippingCost + cart.summary.tax - (appliedCoupon ? (cart.summary.subtotal * appliedCoupon.discount / 100) : 0)

  return (
    <main className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Steps */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-springz-green mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${index < steps.length - 1 ? 'pr-8' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed ? 'bg-springz-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`text-sm font-medium ${step.completed ? 'text-springz-green' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px ${step.completed ? 'bg-springz-green' : 'bg-gray-200'} ml-8`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-2 py-1 text-xs rounded">
                        PIN
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-16"
                        required
                        disabled={!!session?.user?.email}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-shrink-0">
                        <Input
                          id="pin"
                          type="text"
                          placeholder="+91"
                          value={formData.pin}
                          onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                          className="w-20"
                          required
                        />
                      </div>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Address line 1, Street"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp"
                      checked={formData.whatsappOptIn}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsappOptIn: checked as boolean }))}
                    />
                    <Label htmlFor="whatsapp" className="text-sm">
                      Text me with news and offers on WhatsApp
                    </Label>
                  </div>

                  {!formData.pin && (
                    <p className="text-red-500 text-sm">Enter a valid 6-digit PIN</p>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Deliver to address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address1">Address line 1, Building, Street</Label>
                    <Input
                      id="address1"
                      type="text"
                      value={formData.address1}
                      onChange={(e) => setFormData(prev => ({ ...prev, address1: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2">Address line (optional)</Label>
                    <Input
                      id="address2"
                      type="text"
                      value={formData.address2}
                      onChange={(e) => setFormData(prev => ({ ...prev, address2: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billingAddressSame"
                      checked={formData.billingAddressSame}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, billingAddressSame: checked as boolean }))}
                    />
                    <Label htmlFor="billingAddressSame" className="text-sm">
                      Billing address same as shipping
                    </Label>
                  </div>

                  <Button type="button" className="w-full bg-springz-green hover:bg-springz-green/90">
                    Deliver to this address
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.deliveryMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard (3-5 days)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express">Express (1-2 days)</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Choose payment</p>
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Wallet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={item.product.images[0] || "/placeholder-wsy0q.png"}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">{item.size && `${item.size} • `}2 glis</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="w-6 h-6 rounded-full border border-red-300 flex items-center justify-center hover:bg-red-50 text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-sm">{formatINR(item.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                          <span className="text-sm text-green-600">(-{appliedCoupon.discount}%)</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={removeCoupon}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={applyCoupon}>
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatINR(cart.summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{cart.summary.shippingCost === 0 ? 'FREE' : formatINR(cart.summary.shippingCost)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-{formatINR(cart.summary.subtotal * appliedCoupon.discount / 100)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatINR(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Choose Payment Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-springz-green hover:bg-springz-green/90 py-3 text-lg font-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Choose payment"
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-around pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <Shield className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                      <span className="text-xs text-gray-600">Secure<br />checkout</span>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                      <span className="text-xs text-gray-600">30-day<br />returns</span>
                    </div>
                    <div className="text-center">
                      <Award className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                      <span className="text-xs text-gray-600">FSSAI/GMP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}