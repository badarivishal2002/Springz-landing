"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Award } from "lucide-react"
import { allProducts, productCategories, getProductsByCategory, getAllCategories } from "@/data/products"

// Metadata is handled at the layout level for client components

// Get categories with product counts
const getCategoriesWithCounts = () => {
  const allCategories = getAllCategories()
  return [
    { name: "All Products", value: "all", count: allProducts.length, active: true },
    ...allCategories.map(category => ({
      name: category.name,
      value: category.id,
      count: getProductsByCategory(category.id).length,
      active: false
    }))
  ]
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const categories = getCategoriesWithCounts()

  // Update filtered products when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(getProductsByCategory(selectedCategory))
    }
  }, [selectedCategory])

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue)
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

        {/* Categories & Products */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  className={`${
                    selectedCategory === category.value
                      ? "bg-springz-green hover:bg-springz-green/90 text-white"
                      : "border-springz-green/20 hover:bg-springz-green/10 text-gray-700"
                  }`}
                  onClick={() => handleCategoryChange(category.value)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
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
                  Free shipping on all orders over $50. Fast delivery within 3-5 business days.
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
