import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const filePath = `talent/${filename}`

    // Try Supabase Storage first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = getSupabaseClient()
        if (supabase) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('talent-images')
            .upload(filePath, buffer, {
              contentType: file.type,
              upsert: false,
            })
          
          if (uploadError) {
            console.error('❌ Supabase upload error:', uploadError.message)
            throw uploadError
          }
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('talent-images')
            .getPublicUrl(filePath)
          
          const publicUrl = urlData.publicUrl
          
          console.log(`✅ Image uploaded successfully to Supabase: ${publicUrl}`)
          
          return NextResponse.json({ 
            url: publicUrl,
            filename: filename 
          })
        }
      } catch (supabaseError: any) {
        console.error('❌ Supabase upload failed:', supabaseError?.message)
        // Continue to fallback
      }
    }

    // Fallback to local filesystem (local dev only)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'talent')
      const localFilePath = path.join(uploadDir, filename)
      
      // Create directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true })
      
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(localFilePath, buffer)
      
      // Return the public URL
      const publicUrl = `/uploads/talent/${filename}`
      
      console.log(`✅ Image uploaded successfully to local filesystem: ${publicUrl}`)
      
      return NextResponse.json({ 
        url: publicUrl,
        filename: filename 
      })
    } catch (fsError: any) {
      // If filesystem write fails (e.g., on Vercel), return error
      if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
        console.error('❌ Filesystem is read-only. Supabase Storage not configured.')
        return NextResponse.json(
          { 
            error: 'File upload requires Supabase Storage. Please configure Supabase or use an image URL instead.',
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
