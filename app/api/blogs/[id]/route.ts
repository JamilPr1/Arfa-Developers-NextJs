import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { deleteDataFromSupabase, updateDataInSupabase } from '@/lib/supabaseDataUtils'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blogId = parseInt(id)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: blog, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', blogId)
            .single()
          
          if (!error && blog) {
            return NextResponse.json(blog)
          }
          // Silently continue to fallback
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const blogs = await readDataFile('blogs.json')
    const blog = blogs.find((b: any) => b.id === blogId)

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blogId = parseInt(id)
    const updatedBlog = await request.json()
    
    const updatesWithTimestamp = {
      ...updatedBlog,
      id: blogId,
      updatedAt: new Date().toISOString(),
    }
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const updated = await updateDataInSupabase('blogs', blogId, updatesWithTimestamp)
        console.log(`✅ Blog updated successfully in Supabase: ${id}`)
        return NextResponse.json(updated)
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Blog not found' },
            { status: 404 }
          )
        }
        // Silently continue to fallback
      }
    }
    
    // Fallback to file-based system
    const blogs = await readDataFile('blogs.json')
    const index = blogs.findIndex((b: any) => b.id === blogId)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    const existingBlog = blogs[index] as any
    blogs[index] = {
      ...existingBlog,
      ...updatesWithTimestamp,
    }

    await writeDataFile('blogs.json', blogs)
    console.log(`✅ Blog updated successfully: ${id}`)
    return NextResponse.json(blogs[index])
  } catch (error: any) {
    console.error('❌ Error updating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blogId = parseInt(id)
    console.log(`🗑️ Deleting blog ${id}`)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        await deleteDataFromSupabase('blogs', blogId)
        console.log(`✅ Blog deleted successfully from Supabase: ${id}`)
        
        // Revalidate cache
        try {
          revalidatePath('/blog')
          revalidatePath('/api/blogs')
          revalidatePath('/api/admin/blogs')
        } catch (revalidateError) {
          console.warn('Cache revalidation warning:', revalidateError)
        }
        
        return NextResponse.json({ success: true })
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Blog not found' },
            { status: 404 }
          )
        }
        // Silently continue to fallback
      }
    }
    
    // Fallback to file-based system
    const blogs = await readDataFile('blogs.json')
    const filteredBlogs = blogs.filter((b: any) => b.id !== blogId)
    
    if (blogs.length === filteredBlogs.length) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    await writeDataFile('blogs.json', filteredBlogs)
    console.log(`✅ Blog deleted successfully: ${id}`)
    
    // Revalidate cache
    try {
      revalidatePath('/blog')
      revalidatePath('/api/blogs')
      revalidatePath('/api/admin/blogs')
    } catch (revalidateError) {
      console.warn('Cache revalidation warning:', revalidateError)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error deleting blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
