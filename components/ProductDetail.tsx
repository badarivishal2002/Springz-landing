"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  ChevronDown,
  ChevronRight,
  Award,
  Leaf,
  Shield,
  Loader2,
  Play,
  Omega
} from "lucide-react"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { formatINR } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"

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

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [selectedSize, setSelectedSize] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [openFaqs, setOpenFaqs] = useState<number[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const currentPrice = product.sizes.length > 0 ? product.sizes[selectedSize]?.price || product.price : product.price
  const originalPrice = product.sizes.length > 0 ? product.sizes[selectedSize]?.originalPrice || product.originalPrice : product.originalPrice
  const finalPrice = isSubscribed ? currentPrice * 0.9 : currentPrice

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This product is currently out of stock."
      })
      return
    }

    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    setIsAddingToCart(true)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: product.sizes.length > 0 ? product.sizes[selectedSize]?.name || null : null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add to cart')
      }

      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add product to cart'
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product.inStock) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This product is currently out of stock."
      })
      return
    }

    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    setIsBuyingNow(true)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: product.sizes.length > 0 ? product.sizes[selectedSize]?.name || null : null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add to cart')
      }

      router.push('/checkout')
    } catch (error) {
      console.error('Error with buy now:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to process purchase'
      })
    } finally {
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Product Image & Features */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="aspect-square rounded-3xl p-8 relative overflow-hidden" style={{ backgroundColor: '#D4C4A0' }}>
              <img
                src={product.images[0] || "/placeholder-wsy0q.png"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <Omega className="h-8 w-8 text-gray-800 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">High</div>
                <div className="text-sm font-medium text-gray-900">Omega 3</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="w-8 h-8 mx-auto mb-2 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div className="text-sm font-medium text-gray-900">No Added</div>
                <div className="text-sm font-medium text-gray-900">Sugar</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Spirulina</div>
                <div className="text-sm font-medium text-gray-900">Enriched</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <div className="text-sm font-medium text-gray-900">Easy</div>
                <div className="text-sm font-medium text-gray-900">to Digest</div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">{product.shortDescription}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString()}
              </div>
              <div className="text-base text-gray-600">inclusive of all taxes</div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="relative">
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(Number(e.target.value))}
                    className="w-full p-4 pr-10 border border-gray-300 rounded-xl bg-white appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                  >
                    {product.sizes.map((size, index) => (
                      <option key={size.id} value={index} disabled={!size.available}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Subscribe & Save */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={isSubscribed}
                  onChange={(e) => setIsSubscribed(e.target.checked)}
                  className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="subscribe" className="font-medium text-gray-900">
                  Subscribe & Save 10%
                </label>
              </div>
            </div>

            {/* Nutrition Highlights */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.protein}</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.calories}</div>
                <div className="text-sm text-gray-600">Calorie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.fats}</div>
                <div className="text-sm text-gray-600">Fats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{product.sugar}</div>
                <div className="text-sm text-gray-600">Sugar</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock || isBuyingNow}
                className="w-full h-14 text-white text-lg font-semibold rounded-xl"
                style={{ backgroundColor: '#B87333' }}
              >
                {isBuyingNow ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Buy Now"
                )}
              </Button>
              
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                variant="outline"
                className="w-full h-14 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 text-lg font-semibold rounded-xl"
              >
                {isAddingToCart ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>

            {/* Certification Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200">
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">DIAAS</div>
                  <div className="text-xs font-bold text-gray-900">45%</div>
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200">
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">FSSAI</div>
                  <div className="text-xs font-bold text-gray-900">LIONS</div>
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200">
                <Leaf className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200">
                <Leaf className="h-6 w-6 text-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">DIAAS</div>
                <div className="text-sm font-medium text-gray-900">100%</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Clean</div>
                <div className="text-sm font-medium text-gray-900">Label</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Sustainable</div>
              </div>
            </div>

            {!product.inStock && (
              <div className="text-center py-4 text-red-600 font-medium bg-red-50 rounded-xl border border-red-200">
                Currently out of stock
              </div>
            )}
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Ingredients & Nutrition */}
          <div className="space-y-6">
            {/* Ingredients */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
              <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
            </div>

            {/* Nutrition Facts */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b-2 border-gray-900 pb-2">
                  <span className="font-bold">Serving Size</span>
                  <span className="font-bold">{product.servingSize}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Calories</span>
                  <span className="font-semibold">{product.calories}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>Fats</span>
                  <span className="font-semibold">{product.fats}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>6g Carbs</span>
                  <span className="font-semibold">{product.carbs}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>0g Sugar</span>
                  <span className="font-semibold">{product.sugar}</span>
                </div>
              </div>
            </div>

            {/* Ingredients (Duplicate for layout match) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
              <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
            </div>

            {/* Storage Instructions */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <Collapsible>
                <CollapsibleTrigger className="w-full p-6 hover:bg-gray-50 transition-colors rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Storage instructions</h3>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6 text-gray-700">
                  <p>Store in a cool, dry place away from direct sunlight. Keep the container tightly closed after use. Consume within 30 days of opening for best quality.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* FAQ Items */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <Collapsible>
                <CollapsibleTrigger 
                  onClick={() => toggleFaq(0)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Can I mix with milk?</h3>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6 text-gray-700">
                  <p>Yes, you can mix this protein powder with milk for enhanced taste and additional protein content.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200">
              <Collapsible>
                <CollapsibleTrigger 
                  onClick={() => toggleFaq(1)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Is it lactose-free?</h3>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6 text-gray-700">
                  <p>Yes, this plant-based protein is completely lactose-free and suitable for those with lactose intolerance.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Right Column - How to Use & Science */}
          <div className="space-y-6">
            {/* How to Use */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">How to Use</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="text-gray-700">• Mix 1 scoop 250—200 ml of water or milk</div>
                </div>
                <div className="flex space-x-4">
                  <div className="text-gray-700">• Consume post—workout or daily protein</div>
                </div>
              </div>
              
              {/* Video Thumbnail */}
              <div className="mt-6">
                <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl overflow-hidden border border-orange-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                      <Play className="h-8 w-8 text-orange-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    5 • Sarer
                  </div>
                </div>
              </div>
            </div>

            {/* Science & Story */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Science & Story</h3>
              <div className="space-y-4">
                <div className="text-gray-700">• DIAAS-100% formulation for superior amino acid availability</div>
                <div className="text-gray-700">• Clinical-grade sourcing with stringent quality control</div>
                <div className="text-gray-700">• Clean-label: Siotech—verified sourcing</div>
              </div>
              
              {/* Expert Videos */}
              <div className="mt-6 space-y-4">
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden border border-blue-200">
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    5 • stats
                  </div>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl overflow-hidden border border-green-200">
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    4 • Avulor
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl mb-4"></div>
                <h4 className="font-semibold text-gray-900 mb-2">Related Product {i}</h4>
                <p className="text-gray-600 text-sm mb-3">High-quality nutrition supplement</p>
                <div className="text-lg font-bold text-gray-900">₹1,299</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
