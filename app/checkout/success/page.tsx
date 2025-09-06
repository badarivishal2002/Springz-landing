import type { Metadata } from "next"
import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CheckoutSuccessPageClient from "./CheckoutSuccessPageClient"

export const metadata: Metadata = {
  title: "Order Confirmed - Springz Nutrition",
  description: "Your order has been confirmed. Thank you for shopping with Springz Nutrition!",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<div className="flex justify-center items-center py-16">Loading...</div>}>
        <CheckoutSuccessPageClient />
      </Suspense>
      <Footer />
    </div>
  )
}