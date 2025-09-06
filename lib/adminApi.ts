import type { Product, User, Order, Review, ApiResponse } from "./types"

// Mock delay for realistic API simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock admin data
const mockStats = {
  totalSales: 125430.5,
  totalOrders: 1247,
  totalProducts: 12,
  totalUsers: 3456,
}

const mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [],
    subtotal: 89.99,
    tax: 7.2,
    shipping: 0,
    total: 97.19,
    status: "pending",
    shippingAddress: {
      id: "addr-1",
      type: "shipping",
      isDefault: false,
      firstName: "John",
      lastName: "Doe",
      company: "",
      address1: "123 Main St",
      address2: "",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      phone: "555-123-4567",
    },
    billingAddress: {
      id: "addr-2",
      type: "billing",
      isDefault: false,
      firstName: "John",
      lastName: "Doe",
      company: "",
      address1: "123 Main St",
      address2: "",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      phone: "555-123-4567",
    },
    paymentMethod: {
      type: "card",
      cardNumber: "**** **** **** 1234",
      expiryDate: "12/25",
      cvv: "***",
      cardholderName: "John Doe",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
]

const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    addresses: [],
  },
  {
    id: "admin-1",
    email: "admin@springz.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    addresses: [],
  },
]

const mockReviews: Review[] = [
  {
    id: "review-1",
    productId: "elite-protein",
    userId: "user-1",
    userName: "John D.",
    rating: 5,
    title: "Excellent protein powder!",
    comment: "Great taste and mixes well. Highly recommend!",
    status: "pending",
    createdAt: "2024-01-10T15:30:00Z",
  },
]

// Admin API functions
export const adminApi = {
  // Dashboard stats
  async getStats(): Promise<ApiResponse<typeof mockStats>> {
    await delay(500)
    return { success: true, data: mockStats }
  },

  // Product management
  async getProducts(): Promise<ApiResponse<Product[]>> {
    await delay(400)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const products = await response.json()
      return { success: true, data: products }
    } catch (error) {
      return { success: false, error: "Failed to fetch products" }
    }
  },

  async createProduct(product: Omit<Product, "id">): Promise<ApiResponse<Product>> {
    await delay(800)
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
    }
    return { success: true, data: newProduct }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    await delay(600)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      const updatedProduct = await response.json()
      return { success: true, data: updatedProduct }
    } catch (error) {
      return { success: false, error: "Failed to update product" }
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await delay(400)
    return { success: true }
  },

  // Order management
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await delay(600)
    return { success: true, data: mockOrders }
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<ApiResponse<Order>> {
    await delay(400)
    const order = mockOrders.find((o) => o.id === id)
    if (!order) {
      return { success: false, error: "Order not found" }
    }
    order.status = status
    order.updatedAt = new Date().toISOString()
    return { success: true, data: order }
  },

  // User management
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(500)
    return { success: true, data: mockUsers }
  },

  async updateUserRole(id: string, role: User["role"]): Promise<ApiResponse<User>> {
    await delay(400)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    user.role = role
    return { success: true, data: user }
  },

  async updateUserStatus(id: string, status: User["status"]): Promise<ApiResponse<User>> {
    await delay(400)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    user.status = status
    return { success: true, data: user }
  },

  // Review management
  async getReviews(): Promise<ApiResponse<Review[]>> {
    await delay(400)
    return { success: true, data: mockReviews }
  },

  async updateReviewStatus(id: string, status: Review["status"]): Promise<ApiResponse<Review>> {
    await delay(300)
    const review = mockReviews.find((r) => r.id === id)
    if (!review) {
      return { success: false, error: "Review not found" }
    }
    review.status = status
    return { success: true, data: review }
  },

  async deleteReview(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    const index = mockReviews.findIndex((r) => r.id === id)
    if (index === -1) {
      return { success: false, error: "Review not found" }
    }
    mockReviews.splice(index, 1)
    return { success: true }
  },
}
