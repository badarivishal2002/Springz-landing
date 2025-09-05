"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductDetail from "@/components/ProductDetail"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  currency: string
  rating: number
  reviewCount: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  sizes: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    available: boolean
  }>
  servingSize: string
  protein: string
  calories: string
  fats: string
  carbs: string
  sugar: string
  features: Array<{
    id: string
    icon: string
    label: string
    description: string
  }>
  ingredients: string
  nutritionFacts: Array<{
    id: string
    label: string
    value: string
  }>
  howToUse: Array<{
    id: string
    step: number
    instruction: string
  }>
  sciencePoints: Array<{
    id: string
    point: string
  }>
  faqs: Array<{
    id: string
    question: string
    answer: string
  }>
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment: string
    verified: boolean
    helpful: number
    createdAt: string
    user: {
      name: string
      image?: string
    }
  }>
  tags: string[]
  inStock: boolean
  featured: boolean
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch product')
      }
      
      const productData = await response.json()
      setProduct(productData)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
        <Header />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#B87333' }}></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
        <Header />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
              <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
