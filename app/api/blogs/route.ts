import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { insertDataToSupabase } from '@/lib/supabaseDataUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('published', true)
            .order('id', { ascending: false })
          
          if (!error && blogs) {
            const response = NextResponse.json(blogs)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const blogs = await readDataFile('blogs.json')
    const publishedBlogs = blogs.filter((b: any) => b.published)
    
    const response = NextResponse.json(publishedBlogs)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const blog = await request.json()
    
    const newBlog = {
      ...blog,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const created = await insertDataToSupabase('blogs', newBlog)
        console.log(`✅ Blog created successfully in Supabase: ${created.id}`)
        return NextResponse.json(created, { status: 201 })
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const blogs = await readDataFile('blogs.json')
    
    const maxId = blogs.length > 0 
      ? Math.max(...blogs.map((b: any) => b.id || 0)) 
      : 0
    
    const blogWithId = {
      ...newBlog,
      id: maxId + 1,
    }

    blogs.push(blogWithId)
    await writeDataFile('blogs.json', blogs)
    console.log(`✅ Blog created successfully: ${blogWithId.id}`)

    return NextResponse.json(blogWithId, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
