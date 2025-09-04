"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Package,
  Users,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  Edit,
  Loader2,
  RefreshCw,
  AlertCircle,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { formatINR } from "@/lib/currency"

interface AdminStats {
  overview: {
    totalProducts: number
    totalCategories: number
    totalUsers: number
    totalCustomers: number
    totalOrders: number
    totalRevenue: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
    averageOrderValue: number
  }
  orders: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  customers: {
    total: number
    newThisMonth: number
    newLastMonth: number
    growth: number
  }
  products: {
    total: number
    byCategory: Array<{
      categoryId: string
      categoryName: string
      productCount: number
    }>
    topSelling: Array<{
      productId: string
      name: string
      price: number
      image: string | null
      totalSold: number
      orderCount: number
    }>
  }
  reviews: {
    averageRating: number
    totalReviews: number
  }
  recentActivity: {
    recentOrders: Array<{
      id: string
      orderNumber: string
      customerName: string
      customerEmail: string
      total: number
      status: string
      paymentStatus: string
      itemCount: number
      createdAt: string
    }>
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-springz-green mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return null
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'Admin'}! Here's your real-time store overview.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/analytics">
            <Button className="bg-springz-green hover:bg-springz-green/90">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(stats.revenue.total)}</div>
            <p className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.revenue.growth)}`}>
              {getGrowthIcon(stats.revenue.growth)}
              {Math.abs(stats.revenue.growth)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total.toLocaleString()}</div>
            <p className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.orders.growth)}`}>
              {getGrowthIcon(stats.orders.growth)}
              {Math.abs(stats.orders.growth)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.total.toLocaleString()}</div>
            <p className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.customers.growth)}`}>
              {getGrowthIcon(stats.customers.growth)}
              {Math.abs(stats.customers.growth)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(stats.revenue.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reviews.averageRating}/5 avg rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.overview.totalCategories} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(stats.revenue.thisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.thisMonth} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reviews.averageRating}/5 average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Selling Products */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Selling Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  View All Products
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.products.topSelling.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No sales data yet</p>
                <Link href="/admin/products/new">
                  <Button className="mt-4 bg-springz-green hover:bg-springz-green/90">
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.products.topSelling.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder-wsy0q.png"}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">Product ID: {product.productId.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatINR(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.totalSold} units
                        </Badge>
                      </TableCell>
                      <TableCell>{product.orderCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/products/${product.productId}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">#{order.orderNumber}</span>
                        <Badge 
                          variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{order.customerName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {order.itemCount} items • {formatINR(order.total)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.products.byCategory.map((category) => (
              <div key={category.categoryId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{category.categoryName}</p>
                  <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                </div>
                <Badge variant="outline">
                  {Math.round((category.productCount / stats.overview.totalProducts) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/products/new">
              <Button className="bg-springz-green hover:bg-springz-green/90">
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Users
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline">
                <IndianRupee className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}