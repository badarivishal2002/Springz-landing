"use client"

import { useEffect, useState } from "react"
import { adminApi } from "@/lib/adminApi"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Table from "@/components/admin/Table"
import { Search } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getOrders()
      if (response.success && response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await adminApi.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const orderColumns = [
    {
      key: "id",
      label: "Order ID",
      render: (value: string) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: "shippingAddress",
      label: "Customer",
      render: (address: Order["shippingAddress"]) => (
        <div>
          <div className="font-medium">{`${address.firstName} ${address.lastName}`}</div>
          <div className="text-sm text-muted-foreground">
            {address.city}, {address.state}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: Order["status"], order: Order) => (
        <Select value={status} onValueChange={(value: Order["status"]) => handleStatusUpdate(order.id, value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "items",
      label: "Items",
      render: (items: Order["items"]) => `${items.length} item${items.length !== 1 ? "s" : ""}`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Table data={filteredOrders} columns={orderColumns} loading={loading} emptyMessage="No orders found" />
    </div>
  )
}
