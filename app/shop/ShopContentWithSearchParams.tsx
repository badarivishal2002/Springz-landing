"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Award, Search, Filter, Loader2, Package } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  shortDescription: string
  features?: Array<{
    id: string
    icon: string
    label: string
    description: string
  }>
  images: string[]
  inStock: boolean
  tags: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  featured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  count: number
}

function ShopPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState("all")

  // Get URL parameters
  const categoryParam = searchParams.get("category")
  const filterParam = searchParams.get("filter")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Set initial filters from URL params
    if (categoryParam && categories.length > 0) {
      const category = categories.find(cat => cat.slug === categoryParam)
      if (category) {
        setSelectedCategory(category.id)
      }
    }
  }, [categoryParam, categories])

  useEffect(() => {
    // Apply filter from URL param
    if (filterParam && products.length > 0) {
      applyUrlFilter(filterParam)
    } else {
      applyFilters()
    }
  }, [selectedCategory, searchTerm, sortBy, priceRange, products, filterParam])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      
      setProducts(data)
      
      // Extract categories with counts
      const categoryMap = new Map()
      data.forEach((product: Product) => {
        if (product.category) {
          const key = product.category.id
          if (categoryMap.has(key)) {
            categoryMap.get(key).count++
          } else {
            categoryMap.set(key, {
              id: product.category.id,
              name: product.category.name,
              slug: product.category.slug,
              count: 1
            })
          }
        }
      })
      
      const categoriesWithCount = [
        { id: "all", name: "All Products", slug: "all", count: data.length },
        ...Array.from(categoryMap.values())
      ]
      
      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyUrlFilter = (filter: string) => {
    let filtered = products

    switch (filter) {
      case 'high-protein':
        filtered = products.filter(product => 
          product.tags.includes('high-protein') || 
          product.name.toLowerCase().includes('protein') ||
          product.shortDescription.toLowerCase().includes('protein')
        )
        break
      case 'plant-based':
        filtered = products.filter(product => 
          product.tags.includes('plant-based') || 
          product.tags.includes('vegan') ||
          product.shortDescription.toLowerCase().includes('plant')
        )
        break
      case 'traditional':
        filtered = products.filter(product => 
          product.tags.includes('traditional') ||
          product.name.toLowerCase().includes('traditional')
        )
        break
      case 'premium':
        filtered = products.filter(product => 
          product.tags.includes('premium') || 
          product.featured ||
          product.originalPrice && product.originalPrice > product.price
        )
        break
      default:
        applyFilters()
        return
    }

    // Apply additional filters
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply price range filter
    if (priceRange !== "all") {
      filtered = applyPriceFilter(filtered)
    }

    // Apply sorting
    filtered = applySorting(filtered)

    setFilteredProducts(filtered)
  }

  const applyFilters = () => {
    let filtered = products

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category.id === selectedCategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = applyPriceFilter(filtered)
    }

    // Apply sorting
    filtered = applySorting(filtered)

    setFilteredProducts(filtered)
  }

  const applyPriceFilter = (products: Product[]) => {
    switch (priceRange) {
      case "under-500":
        return products.filter(p => p.price < 500)
      case "500-1000":
        return products.filter(p => p.price >= 500 && p.price < 1000)
      case "1000-2000":
        return products.filter(p => p.price >= 1000 && p.price < 2000)
      case "over-2000":
        return products.filter(p => p.price >= 2000)
      default:
        return products
    }
  }

  const applySorting = (products: Product[]) => {
    const sorted = [...products]
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "newest":
        return sorted.sort((a, b) => b.id.localeCompare(a.id))
      case "name":
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue)
    // Clear URL filter when manually selecting category
    if (filterParam) {
      window.history.replaceState({}, '', '/shop')
    }
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSearchTerm("")
    setSortBy("name")
    setPriceRange("all")
    // Clear URL parameters
    window.history.replaceState({}, '', '/shop')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl text-foreground mb-4">
              Premium Protein Supplements
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our scientifically formulated protein supplements designed to fuel your fitness journey and
              maximize your results.
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 bg-white border-b border-green-600/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-500">Under ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                      <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                      <SelectItem value="over-2000">Over ₹2,000</SelectItem>
                    </SelectContent>
                  </Select>

                  {(selectedCategory !== "all" || searchTerm || sortBy !== "name" || priceRange !== "all" || filterParam) && (
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`${
                      selectedCategory === category.id
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-green-600/20 hover:bg-green-600/10 text-gray-700"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>

              {/* Active Filters Display */}
              {(filterParam || searchTerm || selectedCategory !== "all" || priceRange !== "all") && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filterParam && (
                    <span className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-sm">
                      {filterParam.replace('-', ' ')}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== "all" && !filterParam && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      {priceRange.replace('-', ' - ₹')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length === 0 ? 'No products found' : 
                 `${filteredProducts.length} Product${filteredProducts.length !== 1 ? 's' : ''} Found`}
              </h2>
              {filteredProducts.length > 0 && (
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              )}
            </div>

            {/* Products Grid - Using the unified ProductCard component */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== "all" || priceRange !== "all" || filterParam
                    ? "No products match your filters"
                    : "No products available"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== "all" || priceRange !== "all" || filterParam
                    ? "Try adjusting your search criteria or filters."
                    : "Check back soon for new products."}
                </p>
                {(searchTerm || selectedCategory !== "all" || priceRange !== "all" || filterParam) && (
                  <Button onClick={clearFilters} className="bg-green-600 hover:bg-green-700">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <Award className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-playfair font-bold text-xl text-foreground">Lab Tested Quality</h3>
                <p className="text-muted-foreground">
                  Every batch is third-party tested for purity, potency, and safety to ensure premium quality.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold text-xl">30</span>
                </div>
                <h3 className="font-playfair font-bold text-xl text-foreground">30-Day Guarantee</h3>
                <p className="text-muted-foreground">
                  Not satisfied? Return any unopened products within 30 days for a full refund.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold">🚚</span>
                </div>
                <h3 className="font-playfair font-bold text-xl text-foreground">Free Shipping</h3>
                <p className="text-muted-foreground">
                  Free shipping on all orders over ₹2,000. Fast delivery within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ShopContent() {
  return (
    <div className="min-h-screen">
      <ShopPageContent />
    </div>
  )
}
