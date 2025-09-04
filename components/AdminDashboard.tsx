"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Search,
  Filter,
  Download
} from "lucide-react"

// Mock data for demonstration
const mockStats = {
  totalRevenue: 125000,
  totalOrders: 1250,
  totalCustomers: 890,
  totalProducts: 24
}

const mockProducts = [
  {
    id: "1",
    name: "Premium Plant Protein",
    category: "Plant Protein",
    price: 1499,
    stock: 150,
    status: "Active",
    sales: 245
  },
  {
    id: "2", 
    name: "Native Protein Classic",
    category: "Whey Protein",
    price: 1299,
    stock: 89,
    status: "Active",
    sales: 189
  },
  {
    id: "3",
    name: "Recovery Blend",
    category: "Supplements", 
    price: 1799,
    stock: 45,
    status: "Low Stock",
    sales: 67
  }
]

const mockOrders = [
  {
    id: "#SPR001",
    customer: "John Doe",
    email: "john@example.com",
    total: 2998,
    status: "Completed",
    date: "2024-09-01",
    items: 2
  },
  {
    id: "#SPR002", 
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 1499,
    status: "Processing",
    date: "2024-09-02",
    items: 1
  },
  {
    id: "#SPR003",
    customer: "Mike Johnson", 
    email: "mike@example.com",
    total: 3597,
    status: "Shipped",
    date: "2024-09-03",
    items: 3
  }
]

const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    orders: 5,
    spent: 7495,
    joined: "2024-01-15",
    status: "Active"
  },
  {
    id: "2",
    name: "Jane Smith", 
    email: "jane@example.com",
    orders: 3,
    spent: 4497,
    joined: "2024-02-20",
    status: "Active"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com", 
    orders: 8,
    spent: 11992,
    joined: "2023-12-10",
    status: "VIP"
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-springz-green font-medium">+{trend}% from last month</p>
            )}
          </div>
          <div className="w-12 h-12 bg-springz-green/10 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-springz-green" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AddProductForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input id="productName" placeholder="Enter product name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Enter category" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter product description" rows={4} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price (₹)</Label>
            <Input id="originalPrice" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input id="stock" type="number" placeholder="0" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea id="ingredients" placeholder="List all ingredients" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="protein">Protein per serving (g)</Label>
            <Input id="protein" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories per serving</Label>
            <Input id="calories" type="number" placeholder="0" />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button className="bg-springz-green hover:bg-springz-green/90 text-white">
            Add Product
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsAddingProduct(false)}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-bold text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Springz Nutrition store</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full lg:w-auto lg:inline-grid lg:grid-cols-5 bg-white border border-springz-green/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-springz-green data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-springz-green data-[state=active]:text-white">Products</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-springz-green data-[state=active]:text-white">Orders</TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-springz-green data-[state=active]:text-white">Customers</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-springz-green data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`₹${mockStats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={12.5}
            />
            <StatCard
              title="Total Orders"
              value={mockStats.totalOrders.toLocaleString()}
              icon={ShoppingCart}
              trend={8.2}
            />
            <StatCard
              title="Total Customers"
              value={mockStats.totalCustomers.toLocaleString()}
              icon={Users}
              trend={15.3}
            />
            <StatCard
              title="Total Products"
              value={mockStats.totalProducts}
              icon={Package}
              trend={5.1}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-springz-cream rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <p className={`text-xs font-medium ${
                          order.status === 'Completed' ? 'text-green-600' : 
                          order.status === 'Processing' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-springz-cream rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{product.sales} sold</p>
                        <p className="text-sm text-gray-600">₹{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button 
              className="bg-springz-green hover:bg-springz-green/90 text-white"
              onClick={() => setIsAddingProduct(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {isAddingProduct ? (
            <AddProductForm />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 100 ? 'bg-green-100 text-green-800' :
                            product.stock > 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search orders..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="font-bold">₹{order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search customers..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell className="font-bold">₹{customer.spent.toLocaleString()}</TableCell>
                      <TableCell>{customer.joined}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-springz-cream rounded-lg">
                  <p className="text-gray-600">Revenue chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Plant Protein", sales: 245, revenue: 367755 },
                    { name: "Whey Protein", sales: 189, revenue: 245511 },
                    { name: "Supplements", sales: 67, revenue: 120533 }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-springz-cream rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.sales} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{category.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}