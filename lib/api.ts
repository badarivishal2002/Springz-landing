import type { Product, Cart, CartItem, User, Order, ApiResponse, LoginForm, SignupForm, CheckoutForm } from "./types"

// Mock delay for realistic API simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Product API
export const productApi = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    await delay(500)
    try {
      const products = await import("../data/products").then((m) => m.allProducts)
      return { success: true, data: products }
    } catch (error) {
      return { success: false, error: "Failed to fetch products" }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    await delay(300)
    try {
      const products = await import("../data/products").then((m) => m.allProducts)
      const product = products.find((p) => p.slug === slug)
      if (!product) {
        return { success: false, error: "Product not found" }
      }
      return { success: true, data: product }
    } catch (error) {
      return { success: false, error: "Failed to fetch product" }
    }
  },

  async getByCategory(category: string): Promise<ApiResponse<Product[]>> {
    await delay(400)
    try {
      const products = await import("../data/products").then((m) => m.allProducts)
      const filtered = products.filter((p) => p.category === category)
      return { success: true, data: filtered }
    } catch (error) {
      return { success: false, error: "Failed to fetch products by category" }
    }
  },
}

// Cart API (using localStorage for persistence)
export const cartApi = {
  getCart(): Cart {
    if (typeof window === "undefined") {
      return { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 }
    }

    const stored = localStorage.getItem("springs-cart")
    if (!stored) {
      return { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 }
    }

    try {
      return JSON.parse(stored)
    } catch {
      return { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 }
    }
  },

  async addItem(item: Omit<CartItem, "id">): Promise<ApiResponse<Cart>> {
    await delay(200)
    try {
      const cart = this.getCart()
      const existingIndex = cart.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedFlavor.id === item.selectedFlavor.id &&
          i.selectedSize.id === item.selectedSize.id,
      )

      if (existingIndex >= 0) {
        cart.items[existingIndex].quantity += item.quantity
      } else {
        const newItem: CartItem = {
          ...item,
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        cart.items.push(newItem)
      }

      const updatedCart = this.calculateTotals(cart)
      localStorage.setItem("springs-cart", JSON.stringify(updatedCart))
      return { success: true, data: updatedCart }
    } catch (error) {
      return { success: false, error: "Failed to add item to cart" }
    }
  },

  async updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    await delay(200)
    try {
      const cart = this.getCart()
      const itemIndex = cart.items.findIndex((i) => i.id === itemId)

      if (itemIndex === -1) {
        return { success: false, error: "Item not found in cart" }
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1)
      } else {
        cart.items[itemIndex].quantity = quantity
      }

      const updatedCart = this.calculateTotals(cart)
      localStorage.setItem("springs-cart", JSON.stringify(updatedCart))
      return { success: true, data: updatedCart }
    } catch (error) {
      return { success: false, error: "Failed to update cart" }
    }
  },

  async removeItem(itemId: string): Promise<ApiResponse<Cart>> {
    await delay(200)
    try {
      const cart = this.getCart()
      cart.items = cart.items.filter((i) => i.id !== itemId)

      const updatedCart = this.calculateTotals(cart)
      localStorage.setItem("springs-cart", JSON.stringify(updatedCart))
      return { success: true, data: updatedCart }
    } catch (error) {
      return { success: false, error: "Failed to remove item from cart" }
    }
  },

  async clearCart(): Promise<ApiResponse<Cart>> {
    await delay(100)
    try {
      const emptyCart: Cart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 }
      localStorage.setItem("springs-cart", JSON.stringify(emptyCart))
      return { success: true, data: emptyCart }
    } catch (error) {
      return { success: false, error: "Failed to clear cart" }
    }
  },

  calculateTotals(cart: Cart): Cart {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.18 // 18% GST for India
    const shipping = subtotal > 2000 ? 0 : 100 // Free shipping over ₹2000, otherwise ₹100
    const total = subtotal + tax + shipping
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      ...cart,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount,
    }
  },
}

// Auth API (mock implementation)
export const authApi = {
  async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    await delay(800)

    // Mock validation - added admin user
    if (credentials.email === "admin@springz.com" && credentials.password === "admin123") {
      const user: User = {
        id: "admin-1",
        email: credentials.email,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        addresses: [],
      }
      localStorage.setItem("springs-user", JSON.stringify(user))
      // Also set cookie for middleware
      document.cookie = `springs-user=${JSON.stringify(user)}; path=/; max-age=86400`
      return { success: true, data: user }
    }

    if (credentials.email === "demo@springs.com" && credentials.password === "demo123") {
      const user: User = {
        id: "user-1",
        email: credentials.email,
        firstName: "Demo",
        lastName: "User",
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
        addresses: [],
      }
      localStorage.setItem("springs-user", JSON.stringify(user))
      document.cookie = `springs-user=${JSON.stringify(user)}; path=/; max-age=86400`
      return { success: true, data: user }
    }

    return { success: false, error: "Invalid email or password" }
  },

  async signup(userData: SignupForm): Promise<ApiResponse<User>> {
    await delay(1000)

    // Mock validation
    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "customer",
      status: "active",
      createdAt: new Date().toISOString(),
      addresses: [],
    }

    localStorage.setItem("springs-user", JSON.stringify(user))
    document.cookie = `springs-user=${JSON.stringify(user)}; path=/; max-age=86400`
    return { success: true, data: user }
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(200)
    localStorage.removeItem("springs-user")
    document.cookie = "springs-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return { success: true }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem("springs-user")
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  },
}

// Order API
export const orderApi = {
  async createOrder(checkoutData: CheckoutForm): Promise<ApiResponse<Order>> {
    await delay(1500)

    try {
      const cart = cartApi.getCart()
      const user = authApi.getCurrentUser()

      if (cart.items.length === 0) {
        return { success: false, error: "Cart is empty" }
      }

      const order: Order = {
        id: `order-${Date.now()}`,
        userId: user?.id || "guest",
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        status: "pending",
        shippingAddress: {
          id: "addr-1",
          type: "shipping",
          isDefault: false,
          ...checkoutData.shippingAddress,
        },
        billingAddress: {
          id: "addr-2",
          type: "billing",
          isDefault: false,
          ...(checkoutData.sameAsShipping ? checkoutData.shippingAddress : checkoutData.billingAddress),
        },
        paymentMethod: checkoutData.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Clear cart after successful order
      await cartApi.clearCart()

      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: "Failed to create order" }
    }
  },
}
