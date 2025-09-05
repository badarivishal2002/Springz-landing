"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      console.log('Fetching product with ID:', params.id)
      
      const response = await fetch(`/api/products/${params.id}`)
      
      console.log('API Response status:', response.status)
      console.log('API Response ok:', response.ok)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Product not found')
          setError("Product not found")
        } else {
          const errorText = await response.text()
          console.error('API Error:', errorText)
          throw new Error("Failed to fetch product")
        }
        return
      }
      
      const data = await response.json()
      console.log('Product data received:', data)
      setProduct(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading product...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Product not found or error occurred</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>
      <ProductForm product={product} isEditing={true} />
    </div>
  )
}
