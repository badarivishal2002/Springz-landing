"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight, Check, Leaf, Award, Shield, Heart } from "lucide-react"
import Link from "next/link"

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
}

interface ProductCardProps {
  product: Product
}

// Mock product for demo
const mockProduct: Product = {
  id: "1",
  name: "Premium Plant Protein",
  slug: "premium-plant-protein",
  price: 1499,
  originalPrice: 1799,
  rating: 4.9,
  reviewCount: 352,
  shortDescription: "Clean, high-digestibility plant protein for real-world performance.",
  features: [
    { icon: "diaas", label: "DIAAS 100%", description: "Superior amino acid availability" },
    { icon: "clean", label: "Clean Label", description: "No artificial additives" },
    { icon: "sustainable", label: "Sustainable", description: "Eco-friendly sourcing" },
    { icon: "protein", label: "25g Protein", description: "High protein content" }
  ],
  images: ["/native-protein-powder.png"],
  inStock: true,
  tags: ["bestseller", "vegan"],
  category: "protein"
}

export default function ProductCard({ product = mockProduct }: { product?: Product }) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getBadgeInfo = () => {
    if (product.tags.includes("bestseller")) return { text: "🏆 Best Seller", color: "bg-springz-orange" }
    if (product.tags.includes("premium")) return { text: "Premium", color: "bg-springz-green" }
    if (product.tags.includes("vegan")) return { text: "🌿 Vegan", color: "bg-green-600" }
    return null
  }

  const badge = getBadgeInfo()

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsAdding(true)

    // Simulate API call
    setTimeout(() => {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
      setIsAdding(false)
    }, 500)
  }

  return (
    <Card className="product-card-springz group hover:shadow-xl transition-all duration-300 border-0 bg-springz-cream">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <div className="aspect-square bg-white p-6 m-4 rounded-xl">
            <img
              src={product.images[0] || "/native-protein-powder.png"}
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
              {discountPercentage}% OFF
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
            <h3 className="font-bold text-xl text-gray-900 hover:text-springz-green transition-colors cursor-pointer group-hover:text-springz-green">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed">{product.shortDescription}</p>

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
            <span className="text-gray-500 ml-2">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 4).map((feature, index) => {
            // Handle the feature object structure
            const featureLabel = feature.label;
            const getIcon = (iconType: string, label: string) => {
              if (iconType === 'diaas' || label.includes('DIAAS')) return <Award className="h-3 w-3 text-springz-orange" />;
              if (iconType === 'clean' || label.includes('Clean')) return <Shield className="h-3 w-3 text-springz-green" />;
              if (iconType === 'sustainable' || label.includes('Sustainable')) return <Leaf className="h-3 w-3 text-green-600" />;
              if (iconType === 'protein' || label.includes('Protein') || label.includes('25g') || label.includes('12g') || label.includes('10g') || label.includes('8g')) return <Check className="h-3 w-3 text-springz-green" />;
              if (iconType === 'fast' || label.includes('Fast')) return <ArrowRight className="h-3 w-3 text-blue-600" />;
              if (iconType === 'traditional' || label.includes('Traditional')) return <Award className="h-3 w-3 text-orange-600" />;
              if (iconType === 'crunchy' || label.includes('Crunchy')) return <Star className="h-3 w-3 text-yellow-600" />;
              if (iconType === 'ready' || label.includes('Ready')) return <Check className="h-3 w-3 text-springz-green" />;
              if (iconType === 'natural' || label.includes('Natural')) return <Leaf className="h-3 w-3 text-green-600" />;
              if (iconType === 'energy' || label.includes('Energy')) return <Award className="h-3 w-3 text-red-600" />;
              if (iconType === 'roasted' || label.includes('Roasted')) return <Star className="h-3 w-3 text-orange-600" />;
              if (iconType === 'healthy' || label.includes('Healthy')) return <Heart className="h-3 w-3 text-red-500" />;
              return <Check className="h-3 w-3 text-springz-green" />;
            };
            
            return (
              <div key={index} className="flex items-center space-x-1">
                {getIcon(feature.icon, featureLabel)}
                <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-springz-green/20">
                  {featureLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {!product.inStock && (
            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            className={`w-full font-medium text-lg py-3 rounded-lg shadow-lg hover:shadow-xl transition-all ${
              justAdded 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-springz-green hover:bg-springz-green/90 text-white"
            }`}
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              "Adding..."
            ) : justAdded ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Cart!
              </>
            ) : product.inStock ? (
              <>
                Add to Cart
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              "Out of Stock"
            )}
          </Button>

          <Link href={`/product/${product.slug}`}>
            <Button 
              variant="outline" 
              className="w-full bg-white border-springz-green/30 text-springz-green hover:bg-springz-green/10 font-medium py-3 rounded-lg"
            >
              View Full Details
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-springz-green/10">
          <div className="text-center">
            <div className="text-xs text-gray-500">DIAAS</div>
            <div className="text-xs font-semibold text-springz-green">100%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Clean</div>
            <div className="text-xs font-semibold text-springz-green">Label</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">FSSAI</div>
            <div className="text-xs font-semibold text-springz-green">Certified</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}