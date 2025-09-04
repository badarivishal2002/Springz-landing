"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  Eye,
  MousePointer,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react"

// Mock analytics data
const salesData = [
  { month: 'Jan', sales: 45000, orders: 120, customers: 89 },
  { month: 'Feb', sales: 52000, orders: 135, customers: 102 },
  { month: 'Mar', sales: 48000, orders: 128, customers: 95 },
  { month: 'Apr', sales: 61000, orders: 156, customers: 118 },
  { month: 'May', sales: 58000, orders: 149, customers: 112 },
  { month: 'Jun', sales: 67000, orders: 172, customers: 134 },
  { month: 'Jul', sales: 72000, orders: 185, customers: 145 },
  { month: 'Aug', sales: 69000, orders: 178, customers: 139 },
  { month: 'Sep', sales: 75000, orders: 195, customers: 152 },
  { month: 'Oct', sales: 82000, orders: 210, customers: 167 },
  { month: 'Nov', sales: 78000, orders: 201, customers: 159 },
  { month: 'Dec', sales: 89000, orders: 228, customers: 182 }
]

const productPerformance = [
  { name: 'Elite Protein', sales: 89000, percentage: 35, color: '#10B981' },
  { name: 'Native Protein Classic', sales: 67000, percentage: 26, color: '#3B82F6' },
  { name: 'Native Protein Chocolate', sales: 45000, percentage: 18, color: '#F59E0B' },
  { name: 'Nuchhi-Nunde', sales: 32000, percentage: 13, color: '#EF4444' },
  { name: 'Kodubale', sales: 21000, percentage: 8, color: '#8B5CF6' }
]

const trafficData = [
  { source: 'Organic Search', visitors: 12500, percentage: 45, color: '#10B981' },
  { source: 'Direct', visitors: 8200, percentage: 29, color: '#3B82F6' },
  { source: 'Social Media', visitors: 4100, percentage: 15, color: '#F59E0B' },
  { source: 'Referral', visitors: 2100, percentage: 8, color: '#EF4444' },
  { source: 'Email', visitors: 850, percentage: 3, color: '#8B5CF6' }
]

const recentOrdersData = [
  { date: '2024-01-15', orders: 23, revenue: 45600 },
  { date: '2024-01-14', orders: 19, revenue: 38200 },
  { date: '2024-01-13', orders: 31, revenue: 52300 },
  { date: '2024-01-12', orders: 25, revenue: 41800 },
  { date: '2024-01-11', orders: 28, revenue: 49100 },
  { date: '2024-01-10', orders: 22, revenue: 39700 },
  { date: '2024-01-09', orders: 26, revenue: 44200 }
]

const kpiData = {
  totalRevenue: { value: 789000, change: 12.5, trend: 'up' },
  totalOrders: { value: 2156, change: 8.3, trend: 'up' },
  totalCustomers: { value: 1542, change: 15.2, trend: 'up' },
  averageOrderValue: { value: 3650, change: -2.1, trend: 'down' },
  conversionRate: { value: 3.8, change: 0.5, trend: 'up' },
  customerLifetimeValue: { value: 12500, change: 18.7, trend: 'up' }
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12months")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    alert('Analytics data exported successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatINR(kpiData.totalRevenue.value)}</p>
                <div className="flex items-center gap-1 text-sm">
                  {kpiData.totalRevenue.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`${kpiData.totalRevenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.totalRevenue.change}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{kpiData.totalOrders.value.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{kpiData.totalOrders.change}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{kpiData.totalCustomers.value.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{kpiData.totalCustomers.change}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatINR(kpiData.averageOrderValue.value)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">{Math.abs(kpiData.averageOrderValue.change)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{kpiData.conversionRate.value}%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{kpiData.conversionRate.change}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Customer LTV</p>
                <p className="text-2xl font-bold">{formatINR(kpiData.customerLifetimeValue.value)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{kpiData.customerLifetimeValue.change}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <Tooltip formatter={(value) => formatINR(value as number)} />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recentOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <Tooltip formatter={(value) => formatINR(value as number)} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productPerformance}
                      dataKey="sales"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {productPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatINR(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-sm text-gray-600">{formatINR(product.sales)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${product.percentage}%`, 
                            backgroundColor: product.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      dataKey="visitors"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficData.map((traffic, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: traffic.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{traffic.source}</span>
                        <span className="text-sm text-gray-600">{traffic.visitors.toLocaleString()} visitors</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${traffic.percentage}%`, 
                            backgroundColor: traffic.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Orders (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recentOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}