// AWS S3 Upload Implementation
// Replace app/api/upload/route.ts with this code

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// POST /api/upload - Upload to AWS S3
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExtension = file.name.split('.').pop()
    const filename = `products/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly accessible
      Metadata: {
        originalName: file.name,
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
      },
    })

    await s3Client.send(command)
    
    // Construct public URL
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`

    return NextResponse.json({
      url: publicUrl,
      key: filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Error uploading to S3:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete from AWS S3
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { key } = await request.json()

    if (!key) {
      return NextResponse.json(
        { error: 'No key provided' },
        { status: 400 }
      )
    }

    // Delete from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    })

    await s3Client.send(command)

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting from S3:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

// Helper function to extract S3 key from URL
export function extractS3Key(url: string): string | null {
  try {
    const urlParts = url.split('/')
    const keyIndex = urlParts.findIndex(part => part.includes('.amazonaws.com')) + 1
    return urlParts.slice(keyIndex).join('/')
  } catch {
    return null
  }
}
