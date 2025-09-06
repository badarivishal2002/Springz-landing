"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string
  price: number
  category: {
    id: string
    name: string
    description: string
  }
}

interface Category {
  id: string
  name: string
  description: string
  products: Product[]
}

export default function ProductNavigation() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Product Pages</h1>
        <p className="text-gray-600">Navigate to any individual product page</p>
      </div>

      {categories.map((category) => (
        <Card key={category.id} className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            {category.products && category.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                    <p className="text-lg font-bold text-gray-900 mb-3">₹{product.price.toLocaleString()}</p>
                    
                    <Link href={`/product/${product.slug}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        View Product Page
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No products in this category yet.</p>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="text-center">
        <Link href="/shop">
          <Button variant="outline" size="lg" className="mr-4">
            Browse Shop
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
