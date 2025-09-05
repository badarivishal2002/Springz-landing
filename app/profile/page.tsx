"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  MessageSquare, 
  Edit,
  Shield,
  MapPin,
  ArrowLeft,
  Crown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface UserProfile {
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin?callbackUrl=/profile")
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile"
      })
    } finally {
      setLoading(false)
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
            <p className="mt-2 text-gray-600">We couldn't load your profile information.</p>
            <Button onClick={fetchProfile} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {profile.name || 'User'}
                    {profile.role === 'ADMIN' && (
                      <Crown className="h-5 w-5 text-yellow-500" title="Administrator" />
                    )}
                  </h1>
                  
                  <Badge 
                    variant={profile.role === 'ADMIN' ? "default" : "secondary"}
                    className="mb-4"
                  >
                    {profile.role}
                  </Badge>

                  <Link href="/profile/edit" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>

                  {profile.role === 'ADMIN' && (
                    <Link href="/admin" className="w-full mt-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>

                  {profile.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined {formatDate(profile.createdAt)}</span>
                  </div>

                  {profile.dateOfBirth && (
                    <div className="flex items-center space-x-3 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Born {formatDate(profile.dateOfBirth)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile._count.orders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile._count.reviews}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Addresses</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile._count.addresses}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your latest orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start shopping to see your orders here.
                    </p>
                    <Link href="/shop">
                      <Button className="mt-4">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{order.total.toLocaleString()}</div>
                          <Badge 
                            className={`text-xs ${getStatusColor(order.status)}`}
                            variant="secondary"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Link href="/orders">
                        <Button variant="outline">View All Orders</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
