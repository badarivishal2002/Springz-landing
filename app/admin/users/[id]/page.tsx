"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save,
  ArrowLeft,
  Crown,
  Shield,
  UserCheck,
  AlertTriangle,
  Loader2,
  Package,
  MessageSquare,
  MapPin
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserDetail {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'ADMIN' | 'CUSTOMER'
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  createdAt: string
  updatedAt: string
  _count: {
    orders: number
    reviews: number
    addresses: number
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
  }>
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    role: "CUSTOMER" as 'ADMIN' | 'CUSTOMER'
  })

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string)
    }
  }, [params.id])

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      const data = await response.json()
      setUser(data)
      
      // Pre-fill form data
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "",
        gender: data.gender || "",
        role: data.role
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user details"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim() || null,
          phone: formData.phone.trim() || null,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          role: formData.role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update user")
        return
      }

      toast({
        title: "Success",
        description: "User updated successfully!",
      })

      // Refresh user data
      await fetchUser(user.id)
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async (newRole: 'ADMIN' | 'CUSTOMER') => {
    if (!user) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update user role"
        })
        return
      }

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      })

      // Update local state
      setFormData(prev => ({ ...prev, role: newRole }))
      await fetchUser(user.id)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role"
      })
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="mt-2 text-gray-600">The user you're looking for doesn't exist.</p>
        <Link href="/admin/users">
          <Button className="mt-4">Back to Users</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {user.name || 'Unnamed User'}
              {user.role === 'ADMIN' && (
                <Crown className="h-5 w-5 text-yellow-500" title="Administrator" />
              )}
            </h1>
            <p className="text-muted-foreground">Manage user details and permissions</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {user.name || 'Unnamed User'}
                </h2>
                
                <Badge 
                  variant={user.role === 'ADMIN' ? "default" : "secondary"}
                  className="mb-4"
                >
                  {user.role}
                </Badge>

                <div className="w-full">
                  <Label htmlFor="role" className="text-sm font-medium">Change Role</Label>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Select value={formData.role} onValueChange={(value) => {}} disabled={saving}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="ADMIN">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Change User Role
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to change this user's role? This will immediately affect their access permissions.
                          {formData.role === 'CUSTOMER' && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
                              <Shield className="inline h-4 w-4 mr-1" />
                              Making this user an Admin will give them full access to the admin dashboard.
                            </div>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRoleChange(formData.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                        >
                          Confirm Change
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Account Information</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <span>Last updated {formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Orders</span>
                </div>
                <span className="font-semibold">{user._count.orders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Reviews</span>
                </div>
                <span className="font-semibold">{user._count.reviews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Addresses</span>
                </div>
                <span className="font-semibold">{user._count.addresses}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit User Details</CardTitle>
              <CardDescription>
                Update the user's personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                User's latest orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This user hasn't placed any orders.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">#{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{order.total.toLocaleString()}</div>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
