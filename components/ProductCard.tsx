"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight, Check, Leaf, Award, Shield, Heart, ShoppingCart, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatINR } from "@/lib/currency"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  shortDescription: string
  features: Array<{
    icon: string
    label: string
    description: string
  }>
  images: string[]
  inStock: boolean
  tags: string[]
  category: string
  categoryName?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getBadgeInfo = () => {
    if (product.tags.includes("premium")) return { text: "🏆 Premium", color: "bg-springz-orange" }
    if (product.tags.includes("featured")) return { text: "⭐ Featured", color: "bg-springz-green" }
    if (product.tags.includes("plant-based")) return { text: "🌿 Plant-Based", color: "bg-green-600" }
    if (product.tags.includes("traditional")) return { text: "🏛️ Traditional", color: "bg-orange-600" }
    if (product.tags.includes("spicy")) return { text: "🌶️ Spicy", color: "bg-red-600" }
    return null
  }

  const badge = getBadgeInfo()

  const getFeatureIcon = (iconType: string, label: string) => {
    if (iconType === 'leaf' || label.includes('Plant') || label.includes('Organic')) return <Leaf className="h-3 w-3 text-green-600" />
    if (iconType === 'shield' || label.includes('Complete') || label.includes('Quality')) return <Shield className="h-3 w-3 text-springz-green" />
    if (iconType === 'check' || label.includes('Easy') || label.includes('Digestion')) return <Check className="h-3 w-3 text-springz-green" />
    if (iconType === 'star' || label.includes('Premium') || label.includes('Unique')) return <Star className="h-3 w-3 text-springz-orange" />
    if (iconType === 'heart' || label.includes('Time-Tested') || label.includes('Baked') || label.includes('Traditional')) return <Heart className="h-3 w-3 text-red-500" />
    if (iconType === 'zap' || label.includes('Protein') || label.includes('Boost') || label.includes('Metabolism')) return <Zap className="h-3 w-3 text-blue-600" />
    if (iconType === 'award' || label.includes('Real') || label.includes('Natural')) return <Award className="h-3 w-3 text-orange-600" />
    return <Check className="h-3 w-3 text-springz-green" />
  }

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsAddingToCart(true)

    try {
      if (!session) {
        // Redirect to login if not authenticated
        router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
        return
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: null // Default size, can be updated later
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product.inStock) return

    setIsBuyingNow(true)

    try {
      if (!session) {
        // Redirect to login if not authenticated
        router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/product/${product.slug}`))
        return
      }

      // Add to cart first
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      // Redirect to checkout
      router.push('/checkout')
    } catch (error) {
      console.error('Error with buy now:', error)
      alert('Failed to process buy now')
    } finally {
      setIsBuyingNow(false)
    }
  }

  return (
    <Card className="product-card-springz group hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square bg-gray-50 p-6 m-4 rounded-xl">
            <img
              src={product.images[0] || "/placeholder-wsy0q.png"}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
        </Link>

        {badge && (
          <div className="absolute top-6 left-6">
            <span className={`${badge.color} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
              {badge.text}
            </span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="absolute top-6 right-6">
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              Save {formatINR(discountAmount)}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-6 right-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
            <Star className="h-4 w-4 text-springz-orange fill-current" />
            <span className="text-sm font-bold text-gray-900">{product.rating}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Product Info */}
        <div className="space-y-3">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-xl text-gray-900 hover:text-springz-green transition-colors cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.shortDescription}</p>

          <div className="flex items-center space-x-1 text-sm">
            <div className="flex text-springz-orange">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 ml-2">({product.reviewCount})</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1">
              {getFeatureIcon(feature.icon, feature.label)}
              <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-springz-green">{formatINR(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-lg">{formatINR(product.originalPrice)}</span>
            )}
          </div>
          {!product.inStock && (
            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-springz-green hover:bg-springz-green/90 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              disabled={!product.inStock || isBuyingNow}
              onClick={handleBuyNow}
            >
              {isBuyingNow ? (
                "Processing..."
              ) : (
                "Buy Now"
              )}
            </Button>

            <Button
              variant="outline"
              className={`font-medium py-3 rounded-lg border-2 transition-all ${
                justAdded 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "border-springz-green/30 text-springz-green hover:bg-springz-green/10"
              }`}
              disabled={!product.inStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                "Adding..."
              ) : justAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          <Link href={`/product/${product.slug}`}>
            <Button 
              variant="outline" 
              className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-lg"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Premium</div>
            <div className="text-xs font-semibold text-springz-green">Quality</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">FSSAI</div>
            <div className="text-xs font-semibold text-springz-green">Certified</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Free</div>
            <div className="text-xs font-semibold text-springz-green">Shipping</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}