"use client"

import ProductForm from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your catalog</p>
      </div>
      <ProductForm />
    </div>
  )
}
