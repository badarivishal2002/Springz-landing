"use client"

import Link from "next/link"
import { allProducts, getAllCategories } from "@/data/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductNavigation() {
  const categories = getAllCategories()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Product Pages</h1>
        <p className="text-gray-600">Navigate to any individual product page</p>
      </div>

      {categories.map((category) => {
        const categoryProducts = allProducts.filter(p => p.category === category.id)
        
        return (
          <Card key={category.id} className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                    <p className="text-lg font-bold text-gray-900 mb-3">₹{product.price.toLocaleString()}</p>
                    
                    <Link href={`/product/${product.slug}`}>
                      <Button className="w-full bg-springz-green hover:bg-springz-green/90">
                        View Product Page
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="text-center">
        <Link href="/shop">
          <Button variant="outline" size="lg" className="mr-4">
            Browse Shop
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="bg-springz-green hover:bg-springz-green/90">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
