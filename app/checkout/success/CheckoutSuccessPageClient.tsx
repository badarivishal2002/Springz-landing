"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Truck, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPageClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [orderDetails, setOrderDetails] = useState({
    id: orderId || 'ORD-' + Math.random().toString(36).substring(2, 15).toUpperCase(),
    date: new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    email: 'customer@example.com',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  })

  useEffect(() => {
    // Clear cart from localStorage if using client-side cart
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  }, [])

  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="font-bold text-4xl text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order! We've received your payment and will start processing your order shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Order Number</p>
                <p className="font-mono text-2xl font-bold text-gray-900">{orderDetails.id}</p>
                <p className="text-sm text-gray-600">Order placed on {orderDetails.date}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Mail className="h-8 w-8 text-springz-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600">Sent to {orderDetails.email}</p>
                </div>
                
                <div className="text-center">
                  <Truck className="h-8 w-8 text-springz-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                  <p className="text-sm text-gray-600">{orderDetails.estimatedDelivery}</p>
                </div>

                <div className="text-center">
                  <Download className="h-8 w-8 text-springz-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Invoice</h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-sm text-gray-600">We'll prepare your items for shipment within 1-2 business days.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Notification</h3>
                    <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <p className="text-sm text-gray-600">Your order will arrive at your doorstep within 3-5 business days.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card className="bg-springz-cream border border-springz-green">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl text-gray-900 mb-3">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about your order, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-springz-green text-springz-green hover:bg-springz-green hover:text-white">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-springz-green text-springz-green hover:bg-springz-green hover:text-white">
                  Track Your Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto bg-springz-green hover:bg-springz-green/90">
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Share your Springz experience!</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">Share on Instagram</Button>
              <Button variant="outline" size="sm">Write a Review</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}