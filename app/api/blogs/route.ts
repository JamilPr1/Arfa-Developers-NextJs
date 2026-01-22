import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET() {
  try {
    const blogs = await readDataFile('blogs.json')
    const publishedBlogs = blogs.filter((b: any) => b.published)
    return NextResponse.json(publishedBlogs)
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
    const blogs = await readDataFile('blogs.json')
    
    const maxId = blogs.length > 0 
      ? Math.max(...blogs.map((b: any) => b.id || 0)) 
      : 0
    
    const newBlog = {
      ...blog,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    blogs.push(newBlog)
    
    try {
      await writeDataFile('blogs.json', blogs)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog. Please configure Vercel KV for persistent storage.' },
      { status: 500 }
    )
  }
}
