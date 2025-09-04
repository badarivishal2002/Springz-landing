"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart,
  Share2,
  ChevronDown,
  ChevronRight,
  Award,
  Leaf,
  Shield,
  CheckCircle
} from "lucide-react"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import ProductCard from "./ProductCard"
import { allProducts, getProductsByCategory } from "@/data/products"

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
  category: string
  categoryName: string
  sizes: Array<{
    name: string
    price: number
    originalPrice?: number
    available: boolean
  }>
  nutrition: {
    servingSize: string
    protein: string
    calories: string
    fats: string
    carbs: string
    sugar: string
  }
  features: Array<{
    icon: string
    label: string
    description: string
  }>
  ingredients: string
  nutritionFacts: Array<{
    label: string
    value: string
  }>
  howToUse: string[]
  science: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
  tags: string[]
  inStock: boolean
  featured: boolean
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [openFaqs, setOpenFaqs] = useState<number[]>([])

  const currentPrice = product.sizes[selectedSize]?.price || product.price
  const originalPrice = product.sizes[selectedSize]?.originalPrice || product.originalPrice
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0
  const finalPrice = isSubscribed ? currentPrice * 0.9 : currentPrice

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getFeatureIcon = (feature: { icon: string; label: string; description: string }) => {
    if (feature.icon === 'diaas' || feature.label.includes('DIAAS')) return <Award className="h-6 w-6" />
    if (feature.icon === 'clean' || feature.label.includes('Clean')) return <Shield className="h-6 w-6" />
    if (feature.icon === 'sustainable' || feature.label.includes('Sustainable') || feature.label.includes('Organic')) return <Leaf className="h-6 w-6" />
    if (feature.icon === 'fast' || feature.label.includes('Fast')) return <CheckCircle className="h-6 w-6" />
    if (feature.icon === 'protein' || feature.label.includes('Protein')) return <Award className="h-6 w-6" />
    if (feature.icon === 'traditional' || feature.label.includes('Traditional')) return <Award className="h-6 w-6" />
    if (feature.icon === 'natural' || feature.label.includes('Natural')) return <Leaf className="h-6 w-6" />
    if (feature.icon === 'energy' || feature.label.includes('Energy')) return <Award className="h-6 w-6" />
    if (feature.icon === 'roasted' || feature.label.includes('Roasted')) return <CheckCircle className="h-6 w-6" />
    if (feature.icon === 'healthy' || feature.label.includes('Healthy')) return <CheckCircle className="h-6 w-6" />
    return <CheckCircle className="h-6 w-6" />
  }

  // Use product's actual data instead of generating it
  const nutritionFacts = product.nutritionFacts
  const howToUse = product.howToUse
  const science = product.science
  const faqs = product.faqs

  // Get related products from the same category (excluding current product)
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl p-8 shadow-lg">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg p-2 transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-springz-green bg-white' 
                      : 'bg-white hover:ring-1 ring-gray-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div className="space-y-4">
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? "text-springz-orange fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.reviewCount} reviews</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-3xl text-gray-900">
                {product.currency}{Math.round(finalPrice).toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-gray-500 line-through text-xl">
                  {product.currency}{originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">inclusive of all taxes</p>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <label className="font-semibold text-gray-900">Size:</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(index)}
                  disabled={!size.available}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedSize === index
                      ? 'border-springz-green bg-springz-green text-white'
                      : size.available 
                        ? 'border-gray-300 hover:border-springz-green'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe & Save */}
          <div className="bg-springz-cream border border-springz-green rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={(e) => setIsSubscribed(e.target.checked)}
                className="w-4 h-4 text-springz-green"
              />
              <div>
                <span className="font-semibold text-gray-900">Subscribe & Save 10%</span>
                <p className="text-sm text-gray-600">Get regular deliveries and save on every order</p>
              </div>
            </label>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Protein", value: product.nutrition.protein },
              { label: "Calories", value: product.nutrition.calories },
              { label: "Fats", value: product.nutrition.fats },
              { label: "Sugar", value: product.nutrition.sugar }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-lg text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Quantity & Buttons */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="flex-1 bg-springz-orange hover:bg-springz-orange/90 text-white py-4 text-lg font-medium rounded-lg"
              >
                Buy Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 border-2 border-gray-400 text-gray-700 hover:bg-gray-50 py-4 text-lg font-medium rounded-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share Product
              </Button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-springz-green/20">
                <div className="text-springz-green">
                  {getFeatureIcon(feature)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{feature.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Ingredients */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Ingredients</h3>
              <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
            </CardContent>
          </Card>

          {/* Nutrition Facts */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Nutrition Facts</h3>
              <div className="space-y-3">
                {nutritionFacts.map((fact, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{fact.label}</span>
                    <span className="font-semibold text-gray-900">{fact.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Storage Instructions */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Storage Instructions</h3>
              <p className="text-gray-700 leading-relaxed">
                Store in a cool, dry place away from direct sunlight. Close the package tightly after use. 
                Best consumed within 18 months from the date of manufacture.
              </p>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger
                      onClick={() => toggleFaq(index)}
                      className="flex items-center justify-between w-full p-4 bg-springz-cream rounded-lg hover:bg-springz-cream/80 transition-colors"
                    >
                      <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                      <ChevronRight 
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                          openFaqs.includes(index) ? 'rotate-90' : ''
                        }`} 
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 text-gray-700">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* How to Use */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-3">
                {howToUse.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-springz-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
              
              {/* Mock User Reviews */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">What our customers say:</h4>
                {[
                  { name: "Sarer", rating: 5, comment: "Great taste and easy to digest!" },
                  { name: "Avulor", rating: 4, comment: "Perfect for my fitness goals." }
                ].map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-springz-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{review.rating}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{review.name}</span>
                      <div className="flex text-springz-orange">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Science & Story */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Science & Story</h3>
              <div className="space-y-3">
                {science.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-springz-green flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="font-bold text-3xl text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}