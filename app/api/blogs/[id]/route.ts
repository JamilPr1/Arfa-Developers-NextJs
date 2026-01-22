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

    blogs[index] = {
      ...blogs[index],
      ...updatedBlog,
      id: parseInt(id),
      updatedAt: new Date().toISOString(),
    }

    await writeDataFile('blogs.json', blogs)
    return NextResponse.json(blogs[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update blog' },
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

    await writeDataFile('blogs.json', filteredBlogs)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
