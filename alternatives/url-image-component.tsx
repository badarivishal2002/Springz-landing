// Updated ProductForm for URL-only image input
// Replace the image upload section in components/admin/ProductForm.tsx

"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  X, 
  Loader2,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react"
import Image from "next/image"

// Add this to your ProductForm component in the images tab section
export function ImageUrlManager({ images, onImagesChange }: {
  images: string[]
  onImagesChange: (images: string[]) => void
}) {
  const [newImageUrl, setNewImageUrl] = useState("")
  const [validatingUrl, setValidatingUrl] = useState(false)

  const addImageUrl = async () => {
    if (!newImageUrl.trim()) return

    setValidatingUrl(true)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: newImageUrl.trim() })
      })
      
      if (response.ok) {
        const data = await response.json()
        onImagesChange([...images, data.url])
        setNewImageUrl("")
      } else {
        const error = await response.json()
        alert(error.error || 'Invalid image URL')
      }
    } catch (error) {
      alert('Failed to validate image URL')
    } finally {
      setValidatingUrl(false)
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addImageUrl()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden border">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(image, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <Badge className="absolute -top-2 -left-2 bg-blue-500">
                    Primary
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Image URL */}
        <div className="space-y-3">
          <Label htmlFor="imageUrl">Add Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="imageUrl"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addImageUrl}
              disabled={validatingUrl || !newImageUrl.trim()}
              variant="outline"
            >
              {validatingUrl ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter a direct link to an image (JPG, PNG, WebP, GIF). The image will be validated before adding.
          </p>
        </div>

        {/* Image Sources Help */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Free Image Sources:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Unsplash:</strong> unsplash.com (right-click → copy image address)</li>
            <li>• <strong>Pixabay:</strong> pixabay.com (click download → copy link)</li>
            <li>• <strong>Pexels:</strong> pexels.com (right-click → copy image address)</li>
            <li>• <strong>Your hosting:</strong> Upload to your own server/CDN</li>
          </ul>
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No images added yet</p>
            <p className="text-gray-600 mb-4">Add your first product image using a URL</p>
          </div>
        )}

        {/* Error Handling Info */}
        <div className="text-xs text-muted-foreground border-l-4 border-yellow-400 pl-4">
          <strong>Image Requirements:</strong>
          <br />• Must be a direct link to an image file
          <br />• Supported formats: JPG, PNG, WebP, GIF
          <br />• Must be accessible via HTTPS
          <br />• Recommended size: 800x800px or larger
        </div>
      </CardContent>
    </Card>
  )
}

// Usage in your ProductForm component:
// Replace the images tab content with:
/*
<TabsContent value="images" className="space-y-6">
  <ImageUrlManager 
    images={watchedImages || []}
    onImagesChange={(images) => setValue("images", images)}
  />
</TabsContent>
*/
