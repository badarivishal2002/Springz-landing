import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CartPageClient from "./CartPageClient"

export const metadata: Metadata = {
  title: "Shopping Cart - Springs Nutrition",
  description: "Review your selected protein supplements and proceed to checkout.",
}

export default function CartPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <CartPageClient />
      <Footer />
    </div>
  )
}
