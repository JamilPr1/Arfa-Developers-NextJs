import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Disable body parsing, we'll handle it manually
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const ext = path.extname(file.name) || '.jpg'
    const filename = `talent_${timestamp}${ext}`
    
    // Determine upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'talent')
    const filepath = path.join(uploadDir, filename)

    try {
      // Create directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true })
      
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
      
      // Return the public URL
      const publicUrl = `/uploads/talent/${filename}`
      
      console.log(`✅ Image uploaded successfully: ${publicUrl}`)
      
      return NextResponse.json({ 
        url: publicUrl,
        filename: filename 
      })
    } catch (fsError: any) {
      // If filesystem write fails (e.g., on Vercel), return error with instructions
      if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
        console.error('❌ Filesystem is read-only. Cannot save file locally.')
        return NextResponse.json(
          { 
            error: 'File upload not available in production. Please use an image URL instead, or configure cloud storage (e.g., Cloudinary, AWS S3, Vercel Blob).',
            useUrl: true 
          },
          { status: 500 }
        )
      }
      throw fsError
    }
  } catch (error: any) {
    console.error('❌ Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
