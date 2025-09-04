// No-Upload Alternative - Just validate image URLs
// Replace app/api/upload/route.ts with this code

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/upload - Validate image URL instead of uploading
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      const urlObj = new URL(url)
      
      // Check if it's a valid HTTP/HTTPS URL
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return NextResponse.json(
          { error: 'Invalid URL protocol. Only HTTP and HTTPS are allowed.' },
          { status: 400 }
        )
      }

      // Check if URL ends with image extension
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      const pathname = urlObj.pathname.toLowerCase()
      const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext))
      
      if (!hasImageExtension) {
        return NextResponse.json(
          { error: 'URL must point to an image file (.jpg, .png, .webp, .gif)' },
          { status: 400 }
        )
      }

      // Optional: Try to fetch the image to verify it exists
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (!response.ok) {
          return NextResponse.json(
            { error: 'Image URL is not accessible' },
            { status: 400 }
          )
        }

        // Check if content type is an image
        const contentType = response.headers.get('content-type')
        if (contentType && !contentType.startsWith('image/')) {
          return NextResponse.json(
            { error: 'URL does not point to an image' },
            { status: 400 }
          )
        }
      } catch (fetchError) {
        return NextResponse.json(
          { error: 'Cannot verify image URL accessibility' },
          { status: 400 }
        )
      }

      // Return the validated URL
      return NextResponse.json({
        url: url,
        validated: true,
        timestamp: new Date().toISOString(),
      })
    } catch (urlError) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error validating image URL:', error)
    return NextResponse.json(
      { error: 'Failed to validate image URL' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - No-op for URL validation
export async function DELETE(request: NextRequest) {
  return NextResponse.json({ 
    message: 'URL removed from product (no actual deletion needed)' 
  })
}
