import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CheckoutPageClient from "./CheckoutPageClient"

export const metadata: Metadata = {
  title: "Checkout - Springs Nutrition",
  description: "Complete your order for premium protein supplements from Springs Nutrition.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <CheckoutPageClient />
      <Footer />
    </div>
  )
}
