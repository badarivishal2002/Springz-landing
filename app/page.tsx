"use client"

import { useEffect, useState } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Carousel from "@/components/Carousel"
import PromoModal from "@/components/PromoModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Award, Users, Zap, Star, CheckCircle, TrendingUp, Shield, Truck, Beaker, Leaf, TestTube, Play, Loader2, Package } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { formatINR } from "@/lib/currency"

const heroSlides = [
  {
    id: 1,
    image: "/native-protein-powder.png",
    title: "Science-grade nutrition. Everyday taste.",
    subtitle: "DIAAS 100% formulas, clean label. Sustainable ingredients for optimal performance.",
    buttonText: "Shop Proteins",
    buttonLink: "/shop",
  },
  {
    id: 2,
    image: "/athletic-person-protein-shake.png", 
    title: "Fuel Your Performance",
    subtitle: "Premium plant protein designed for serious athletes and fitness enthusiasts.",
    buttonText: "View Products",
    buttonLink: "/shop",
  },
  {
    id: 3,
    image: "/recovery-blend-ingredients.png",
    title: "Clean Label Promise",
    subtitle: "No artificial additives, no fillers. Just pure, science-backed nutrition you can trust.",
    buttonText: "Learn More",
    buttonLink: "/about",
  },
  {
    id: 4,
    image: "/placeholder-wsy0q.png",
    title: "DIAAS-100% Superior",
    subtitle: "Superior amino acid availability for maximum muscle protein synthesis.",
    buttonText: "Discover Science",
    buttonLink: "/about",
  },
  {
    id: 5,
    image: "/nutrition-lab.png",
    title: "Sustainable Future",
    subtitle: "Eco-friendly packaging and responsible sourcing for a better tomorrow.",
    buttonText: "Our Story",
    buttonLink: "/about",
  }
]

const testimonials = [
  {
    name: "Ananya Athreya",
    content: "Great tasty and easy to digest. The Elite Protein has become my daily go-to!",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    name: "Raghav Shanti", 
    content: "Complete protein for my fitness goals. Love the Nuchhi-Nunde traditional blend.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    name: "Priya Kumar",
    content: "Perfect for busy mornings. The chocolate protein tastes amazing!",
    rating: 5,
    image: "/placeholder-user.jpg"
  }
]

interface HomepageData {
  featuredProducts: any[]
  categories: any[]
  stats: {
    productsAvailable: number
    happyCustomers: number
    ordersDelivered: number
    averageRating: number
    totalReviews: number
  }
}

export default function HomePage() {
  const [data, setData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch('/api/homepage')
        if (!response.ok) {
          throw new Error('Failed to fetch homepage data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Error fetching homepage data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto mb-4" />
            <p className="text-gray-600">Loading fresh content...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading homepage data</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />

      <main>
        {/* Hero Carousel - 5 Slides */}
        <section className="relative">
          <Carousel slides={heroSlides} />
        </section>

        {/* Trust Indicators Bar - Using Real Stats */}
        <section className="py-8 bg-white border-y border-springz-green/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Leaf className="h-8 w-8 text-springz-green" />
                <span className="font-semibold text-gray-900">{data.stats.productsAvailable}+ Products</span>
                <span className="text-xs text-gray-600">Premium quality</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 text-springz-green" />
                <span className="font-semibold text-gray-900">{data.stats.happyCustomers}+ Customers</span>
                <span className="text-xs text-gray-600">Trust our products</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-8 w-8 text-springz-green" />
                <span className="font-semibold text-gray-900">FSSAI Certified</span>
                <span className="text-xs text-gray-600">Quality assured</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Star className="h-8 w-8 text-springz-green" />
                <span className="font-semibold text-gray-900">{data.stats.averageRating}/5 Rating</span>
                <span className="text-xs text-gray-600">{data.stats.totalReviews} reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories - Real Data */}
        <section className="py-20 bg-springz-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-bold text-4xl text-gray-900 mb-4">Explore Our Categories</h2>
              <p className="text-gray-600 text-lg">Premium nutrition products for every lifestyle</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {data.categories.map((category) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all bg-white border-0 rounded-2xl cursor-pointer">
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={category.image || "/placeholder-wsy0q.png"} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-bold text-2xl text-white mb-2">{category.name}</h3>
                        <p className="text-white/80 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop?filter=high-protein">
                <Button variant="outline" className="bg-white border-springz-green/20 text-gray-700 hover:bg-springz-green hover:text-white rounded-full px-6 py-2 transition-all">
                  High Protein
                </Button>
              </Link>
              <Link href="/shop?filter=plant-based">
                <Button variant="outline" className="bg-white border-springz-green/20 text-gray-700 hover:bg-springz-green hover:text-white rounded-full px-6 py-2 transition-all">
                  Plant Based
                </Button>
              </Link>
              <Link href="/shop?filter=traditional">
                <Button variant="outline" className="bg-white border-springz-green/20 text-gray-700 hover:bg-springz-green hover:text-white rounded-full px-6 py-2 transition-all">
                  Traditional
                </Button>
              </Link>
              <Link href="/shop?filter=premium">
                <Button variant="outline" className="bg-white border-springz-green/20 text-gray-700 hover:bg-springz-green hover:text-white rounded-full px-6 py-2 transition-all">
                  Premium Quality
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Health Plan & Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left - Health Plan */}
              <Card className="bg-springz-green text-white overflow-hidden rounded-3xl shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-bold text-3xl">Measure, Plan, Fuel.</h2>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <div className="flex justify-center items-center space-x-8 text-center">
                        <div>
                          <div className="text-4xl font-bold">25g</div>
                          <div className="text-sm opacity-80">PROTEIN/SERVING</div>
                        </div>
                        <div>
                          <div className="text-4xl font-bold">30</div>
                          <div className="text-sm opacity-80">SERVINGS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/shop">
                      <Button 
                        size="lg" 
                        className="w-full bg-white text-springz-green hover:bg-gray-50 px-6 py-3 text-lg rounded-lg font-medium"
                      >
                        Get My Plan
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full border-2 border-white text-white hover:bg-white/10 px-6 py-3 text-lg rounded-lg font-medium"
                      >
                        See Nutrition Guide
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Right - Testimonials */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-4xl text-gray-900 mb-2">Real results, real people.</h2>
                  <p className="text-gray-600">See what our customers are saying about our products</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white border-0 hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-springz-green rounded-full flex items-center justify-center mx-auto mb-3">
                              <Users className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-xs font-bold text-gray-600">Customer #{index + 1}</div>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex text-springz-orange">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm font-medium">"{testimonial.content}"</p>
                          <div className="text-xs text-gray-600 font-semibold">{testimonial.name}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Using Unified ProductCard Component */}
        <section className="py-20 bg-springz-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-bold text-4xl text-gray-900">Featured Products</h2>
                <p className="text-gray-600 mt-2">Hand-picked products for your health goals</p>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg px-6">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {data.featuredProducts.length > 0 ? (
              <>
                {/* Using the same ProductCard component as shop page for consistency */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {data.featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* View All Products */}
                <div className="text-center mt-12">
                  <Link href="/shop">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-springz-green text-springz-green hover:bg-springz-green hover:text-white px-12 py-4 text-lg rounded-lg font-medium transition-all"
                    >
                      View All Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Products</h3>
                <p className="text-gray-600">Check back soon for our featured product selections.</p>
                <Link href="/shop" className="inline-block mt-4">
                  <Button className="bg-springz-green hover:bg-springz-green/90">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Product Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-4xl text-gray-900 mb-4">Why Choose Springz?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're committed to delivering the highest quality nutrition products with complete transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-green rounded-full flex items-center justify-center mx-auto">
                    <TestTube className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Lab Tested Quality</h3>
                  <p className="text-gray-600">
                    Every batch is third-party tested for purity, potency, and safety to ensure premium quality.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-green rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">30-Day Guarantee</h3>
                  <p className="text-gray-600">
                    Not satisfied? Return any unopened products within 30 days for a full refund.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-springz-green rounded-full flex items-center justify-center mx-auto">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Free Shipping</h3>
                  <p className="text-gray-600">
                    Free shipping on all orders over ₹2,000. Fast delivery within 3-5 business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Promo Modal */}
      <PromoModal
        title="Welcome to Springz Nutrition!"
        description="Get 15% off your first order with code WELCOME15. Limited time offer for new customers."
        buttonText="Shop Now"
      />
    </div>
  )
}