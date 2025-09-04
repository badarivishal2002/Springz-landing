# 🔗 Frontend Integration Guide

## 🎯 How to Replace Static Data with Dynamic API Calls

This guide shows you how to update your existing components to use the new database-driven backend.

---

## 📦 Update Product Components

### 1. Replace Static Product Data

**Before (Static):**
```tsx
// components/ProductGrid.tsx
const products = [
  {
    id: 1,
    name: "Whey Protein Isolate",
    price: 2499,
    // ... static data
  }
]
```

**After (Dynamic):**
```tsx
// components/ProductGrid.tsx
"use client"

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  category: {
    name: string
    slug: string
  }
  inStock: boolean
  featured: boolean
  rating: number
  reviewCount: number
}

export default function ProductGrid({ featured = false }: { featured?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [featured])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = featured ? '/api/products?featured=true' : '/api/products'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 2. Update Individual Product Pages

**Create Dynamic Product Page:**
```tsx
// app/product/[slug]/page.tsx
interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      // Add cache revalidation for production
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Use your existing ProductDetails component */}
        <ProductDetails product={product} />
        
        {/* Add new review section */}
        <ReviewSection productId={product.id} />
      </main>
      <Footer />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - Springz Nutrition'
    }
  }

  return {
    title: `${product.name} - Springz Nutrition`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((img: string) => ({
        url: img,
        width: 800,
        height: 600,
      })),
    },
  }
}
```

### 3. Create Review Section Component

```tsx
// components/ReviewSection.tsx
"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  verified: boolean
  createdAt: string
  user: {
    name: string
    image?: string
  }
}

interface ReviewSectionProps {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      // Redirect to login
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          ...newReview
        })
      })

      if (response.ok) {
        setShowForm(false)
        setNewReview({ rating: 5, title: '', comment: '' })
        fetchReviews() // Refresh reviews
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      alert('Failed to submit review')
    }
  }

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        onClick={() => interactive && onChange && onChange(i + 1)}
      />
    ))
  }

  if (loading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4 w-32"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {session && (
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-springz-green hover:bg-springz-green/90"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Great product!"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-springz-green hover:bg-springz-green/90">
                  Submit Review
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      {review.verified && (
                        <Badge variant="secondary">Verified Purchase</Badge>
                      )}
                    </div>
                    
                    {review.title && (
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="text-sm text-gray-500">
                      By {review.user.name} • {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
```

---

## 🏠 Update Homepage Components

### 1. Featured Products Section

```tsx
// components/FeaturedProducts.tsx
"use client"

import { useState, useEffect } from 'react'
import ProductGrid from './ProductGrid'

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <ProductGrid featured={true} />
      </div>
    </section>
  )
}
```

### 2. Categories Section

```tsx
// components/CategoriesSection.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  _count: {
    products: number
  }
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-32 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 bg-springz-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                {category.image && (
                  <div className="relative h-24 w-24 mx-auto mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-springz-green transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                <p className="text-xs text-gray-500">{category._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 🔐 Update Authentication State

### 1. Add User Navigation

```tsx
// components/Header.tsx - Update to include auth state
"use client"

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, LogOut, ShoppingBag } from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-springz-green">
            Springz Nutrition
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-springz-green">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-springz-green">Products</Link>
            <Link href="/about" className="text-gray-700 hover:text-springz-green">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-springz-green">Contact</Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button 
                  className="bg-springz-green hover:bg-springz-green/90"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
```

---

## 🏁 Final Integration Steps

### 1. Update Root Layout

```tsx
// app/layout.tsx - Make sure to wrap with SessionProvider
import { SessionProvider } from "@/components/SessionProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### 2. Add Loading States

Create a consistent loading component:

```tsx
// components/LoadingSpinner.tsx
export default function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClass = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12"
  }[size]

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-springz-green ${sizeClass}`}></div>
    </div>
  )
}
```

### 3. Error Handling

Create an error boundary component:

```tsx
// components/ErrorBoundary.tsx
"use client"

import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        We're sorry, but something went wrong. Please try again or contact support if the problem persists.
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} className="bg-springz-green hover:bg-springz-green/90">
          Try Again
        </Button>
      )}
    </div>
  )
}
```

---

## ✅ Integration Checklist

- [ ] Replace static product data with API calls
- [ ] Update individual product pages to use dynamic routing
- [ ] Add review functionality to product pages
- [ ] Update homepage to show dynamic featured products
- [ ] Add category browsing functionality
- [ ] Implement user authentication state in header
- [ ] Add loading states to all data-fetching components
- [ ] Add error handling for API failures
- [ ] Test all functionality end-to-end
- [ ] Update SEO metadata for dynamic content

---

## 🚀 You're Ready!

Once you've completed these integrations:

1. **Test the full flow** from customer registration to product review
2. **Verify admin functionality** works properly
3. **Check mobile responsiveness** across all new components
4. **Test error scenarios** (network failures, invalid data)
5. **Performance test** with multiple products and reviews

Your Springz Nutrition website is now a fully functional e-commerce platform! 🎉
