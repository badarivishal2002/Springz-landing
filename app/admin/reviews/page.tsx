"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Star, 
  Trash2, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  User,
  Package,
  Filter,
  Search
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  verified: boolean
  helpful: number
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [filterVerified, setFilterVerified] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reviews?limit=50')
      if (!response.ok) throw new Error('Failed to fetch reviews')
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reviews"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateReviewVerification = async (reviewId: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verified })
      })
      
      if (!response.ok) throw new Error('Failed to update review')
      
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, verified }
          : review
      ))
      
      toast({
        title: "Success",
        description: `Review ${verified ? 'verified' : 'unverified'} successfully`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review"
      })
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete review')
      
      setReviews(reviews.filter(review => review.id !== reviewId))
      
      toast({
        title: "Success",
        description: "Review deleted successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete review"
      })
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating)
    const matchesVerified = 
      filterVerified === "all" || 
      (filterVerified === "verified" && review.verified) ||
      (filterVerified === "unverified" && !review.verified)
    
    return matchesSearch && matchesRating && matchesVerified
  })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-springz-green"></div>
      </div>
    )
  }

  const stats = {
    total: reviews.length,
    verified: reviews.filter(r => r.verified).length,
    pending: reviews.filter(r => !r.verified).length,
    avgRating: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews, products, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVerified} onValueChange={setFilterVerified}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Reviews ({filteredReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {searchTerm || filterRating !== "all" || filterVerified !== "all" 
                  ? "No reviews match your filters" 
                  : "No reviews yet"
                }
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || filterRating !== "all" || filterVerified !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Reviews will appear here as customers leave feedback."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="max-w-[300px]">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.title && (
                          <div className="font-medium text-sm">{review.title}</div>
                        )}
                        <div className="text-sm text-muted-foreground line-clamp-3">
                          {review.comment}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Link 
                        href={`/product/${review.product.slug}`}
                        className="flex items-center space-x-2 hover:text-springz-green"
                      >
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium">{review.product.name}</span>
                      </Link>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{review.user.name}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={review.verified ? "default" : "secondary"}>
                        {review.verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!review.verified ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateReviewVerification(review.id, true)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateReviewVerification(review.id, false)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteReview(review.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
