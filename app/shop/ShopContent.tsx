"use client"

import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Loader2 } from "lucide-react"
import ShopContentWithSearchParams from "./ShopContentWithSearchParams"

function ShopLoadingFallback() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shop...</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function ShopContent() {
  return (
    <Suspense fallback={<ShopLoadingFallback />}>
      <ShopContentWithSearchParams />
    </Suspense>
  )
}
