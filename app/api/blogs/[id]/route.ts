import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blogs = await readDataFile('blogs.json')
    const blog = blogs.find((b: any) => b.id === parseInt(id))

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
    const updatedBlog = await request.json()
    const blogs = await readDataFile('blogs.json')
    
    const index = blogs.findIndex((b: any) => b.id === parseInt(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    const existingBlog = blogs[index] as any
    blogs[index] = {
      ...existingBlog,
      ...updatedBlog,
      id: parseInt(id),
      updatedAt: new Date().toISOString(),
    }

    try {
      await writeDataFile('blogs.json', blogs)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }
    return NextResponse.json(blogs[index])
  } catch (error: any) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog. Please configure Vercel KV for persistent storage.' },
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
    const blogs = await readDataFile('blogs.json')
    const filteredBlogs = blogs.filter((b: any) => b.id !== parseInt(id))

    try {
      await writeDataFile('blogs.json', filteredBlogs)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog. Please configure Vercel KV for persistent storage.' },
      { status: 500 }
    )
  }
}
