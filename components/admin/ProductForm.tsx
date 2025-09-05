"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  servingSize: z.string().min(1, "Serving size is required"),
  protein: z.string().min(1, "Protein is required"),
  calories: z.string().min(1, "Calories is required"),
  fats: z.string().min(1, "Fats is required"),
  carbs: z.string().min(1, "Carbs is required"),
  sugar: z.string().min(1, "Sugar is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  tags: z.array(z.string()),
  inStock: z.boolean(),
  featured: z.boolean(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sizes: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    available: z.boolean()
  })),
  features: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    description: z.string()
  })),
  nutritionFacts: z.array(z.object({
    label: z.string(),
    value: z.string()
  })),
  howToUse: z.array(z.object({
    step: z.number(),
    instruction: z.string()
  })),
  sciencePoints: z.array(z.string()),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormProps {
  product?: any // Product data for editing
  isEditing?: boolean
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 0,
      originalPrice: undefined,
      categoryId: "",
      servingSize: "",
      protein: "",
      calories: "",
      fats: "",
      carbs: "",
      sugar: "",
      ingredients: "",
      tags: [],
      inStock: true,
      featured: false,
      images: [],
      sizes: [],
      features: [],
      nutritionFacts: [],
      howToUse: [],
      sciencePoints: [],
      faqs: []
    }
  })

  // Field arrays for dynamic sections
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizes"
  })

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features"
  })

  const { fields: nutritionFields, append: appendNutrition, remove: removeNutrition } = useFieldArray({
    control,
    name: "nutritionFacts"
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "howToUse"
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs"
  })

  // Watch form values
  const watchedName = watch("name")
  const watchedImages = watch("images")
  const watchedTags = watch("tags")
  const watchedSciencePoints = watch("sciencePoints")

  useEffect(() => {
    fetchCategories()
  }, [])

  // Load product data when editing
  useEffect(() => {
    if (product && isEditing) {
      reset({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price || 0,
        originalPrice: product.originalPrice,
        categoryId: product.category?.id || product.categoryId || "",
        servingSize: product.servingSize || "",
        protein: product.protein || "",
        calories: product.calories || "",
        fats: product.fats || "",
        carbs: product.carbs || "",
        sugar: product.sugar || "",
        ingredients: product.ingredients || "",
        tags: product.tags || [],
        inStock: product.inStock ?? true,
        featured: product.featured ?? false,
        images: product.images || [],
        sizes: product.sizes || [],
        features: product.features || [],
        nutritionFacts: product.nutritionFacts || [],
        howToUse: product.howToUse || [],
        sciencePoints: product.sciencePoints || [],
        faqs: product.faqs || []
      })
    }
  }, [product, isEditing, reset])

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setValue("slug", slug)
    }
  }, [watchedName, setValue, isEditing])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Image upload with drag & drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true)
    const currentImages = getValues("images")
    
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          setValue("images", [...currentImages, url])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
    
    setUploadingImages(false)
  }, [setValue, getValues])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  })

  const removeImage = (index: number) => {
    const currentImages = getValues("images")
    setValue("images", currentImages.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = getValues("tags")
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (index: number) => {
    const currentTags = getValues("tags")
    setValue("tags", currentTags.filter((_, i) => i !== index))
  }

  const addSciencePoint = () => {
    const currentPoints = getValues("sciencePoints")
    setValue("sciencePoints", [...currentPoints, ""])
  }

  const updateSciencePoint = (index: number, value: string) => {
    const currentPoints = getValues("sciencePoints")
    const updated = [...currentPoints]
    updated[index] = value
    setValue("sciencePoints", updated)
  }

  const removeSciencePoint = (index: number) => {
    const currentPoints = getValues("sciencePoints")
    setValue("sciencePoints", currentPoints.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    
    try {
      console.log('Submitting product data:', data)
      
      const url = isEditing ? `/api/products/${product.id}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Product saved successfully:', result)
        router.push('/admin/products')
      } else {
        const error = await response.json()
        console.error('Failed to save product:', error)
        alert(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-springz-green hover:bg-springz-green/90"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="product-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  {...register("shortDescription")}
                  placeholder="Brief product description"
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-600">{errors.shortDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed product description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    {...register("originalPrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select 
                    value={watch("categoryId")} 
                    onValueChange={(value) => setValue("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients *</Label>
                <Textarea
                  id="ingredients"
                  {...register("ingredients")}
                  placeholder="List all ingredients"
                  rows={3}
                />
                {errors.ingredients && (
                  <p className="text-sm text-red-600">{errors.ingredients.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={watch("inStock")}
                    onCheckedChange={(checked) => setValue("inStock", checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => setValue("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedTags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Images */}
              {watchedImages?.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {watchedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square relative rounded-lg overflow-hidden border">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-springz-green bg-springz-green/5' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {uploadingImages ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <span>Uploading images...</span>
                  </div>
                ) : isDragActive ? (
                  <p>Drop the images here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drop images here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {errors.images && (
                <p className="text-sm text-red-600">{errors.images.message}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Nutrition */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servingSize">Serving Size *</Label>
                  <Input
                    id="servingSize"
                    {...register("servingSize")}
                    placeholder="35g"
                  />
                  {errors.servingSize && (
                    <p className="text-sm text-red-600">{errors.servingSize.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protein">Protein *</Label>
                  <Input
                    id="protein"
                    {...register("protein")}
                    placeholder="25g"
                  />
                  {errors.protein && (
                    <p className="text-sm text-red-600">{errors.protein.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories *</Label>
                  <Input
                    id="calories"
                    {...register("calories")}
                    placeholder="135"
                  />
                  {errors.calories && (
                    <p className="text-sm text-red-600">{errors.calories.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats *</Label>
                  <Input
                    id="fats"
                    {...register("fats")}
                    placeholder="3.5g"
                  />
                  {errors.fats && (
                    <p className="text-sm text-red-600">{errors.fats.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs *</Label>
                  <Input
                    id="carbs"
                    {...register("carbs")}
                    placeholder="6g"
                  />
                  {errors.carbs && (
                    <p className="text-sm text-red-600">{errors.carbs.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sugar">Sugar *</Label>
                  <Input
                    id="sugar"
                    {...register("sugar")}
                    placeholder="0.5g"
                  />
                  {errors.sugar && (
                    <p className="text-sm text-red-600">{errors.sugar.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Detailed Nutrition Facts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Detailed Nutrition Facts</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendNutrition({ label: "", value: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fact
                  </Button>
                </div>

                {nutritionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Label</Label>
                      <Input
                        {...register(`nutritionFacts.${index}.label`)}
                        placeholder="Sodium"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Value</Label>
                      <Input
                        {...register(`nutritionFacts.${index}.value`)}
                        placeholder="120mg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeNutrition(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendFeature({ icon: "", label: "", description: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>

              {featureFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select 
                      value={watch(`features.${index}.icon`)} 
                      onValueChange={(value) => setValue(`features.${index}.icon`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaas">DIAAS</SelectItem>
                        <SelectItem value="clean">Clean Label</SelectItem>
                        <SelectItem value="sustainable">Sustainable</SelectItem>
                        <SelectItem value="protein">Protein</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      {...register(`features.${index}.label`)}
                      placeholder="25g Protein"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      {...register(`features.${index}.description`)}
                      placeholder="High protein content"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="col-span-3"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Feature
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants (Sizes) */}
        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Available Sizes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSize({ name: "", price: 0, available: true })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Size
                </Button>
              </div>

              {sizeFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Size Name</Label>
                    <Input
                      {...register(`sizes.${index}.name`)}
                      placeholder="900g"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`sizes.${index}.price`, { valueAsNumber: true })}
                      placeholder="1499"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Original Price (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`sizes.${index}.originalPrice`, { valueAsNumber: true })}
                      placeholder="1799"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={watch(`sizes.${index}.available`)} 
                      onCheckedChange={(checked) => setValue(`sizes.${index}.available`, checked)} 
                    />
                    <Label>Available</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content" className="space-y-6">
          {/* How to Use */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Usage Instructions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendInstruction({ 
                    step: instructionFields.length + 1, 
                    instruction: "" 
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>

              {instructionFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <div className="w-20 space-y-2">
                    <Label>Step</Label>
                    <Input
                      type="number"
                      {...register(`howToUse.${index}.step`, { valueAsNumber: true })}
                      value={index + 1}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Instruction</Label>
                    <Textarea
                      {...register(`howToUse.${index}.instruction`)}
                      placeholder="Mix 1 scoop with 250ml of water"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Science Points */}
          <Card>
            <CardHeader>
              <CardTitle>Science & Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Science Points</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSciencePoint}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Point
                </Button>
              </div>

              {watchedSciencePoints?.map((point, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Science Point</Label>
                    <Textarea
                      value={point}
                      onChange={(e) => updateSciencePoint(index, e.target.value)}
                      placeholder="DIAAS-100% formulation for superior amino acid availability"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSciencePoint(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">FAQs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {faqFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      {...register(`faqs.${index}.question`)}
                      placeholder="Can I mix this with milk?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      {...register(`faqs.${index}.answer`)}
                      placeholder="Yes, you can mix this protein with milk, water, or your favorite plant-based milk alternative."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFaq(index)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove FAQ
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
