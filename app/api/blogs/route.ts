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
    
    const newBlog = {
      ...blog,
      id: blogs.length > 0 ? Math.max(...blogs.map((b: any) => b.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    blogs.push(newBlog)
    await writeDataFile('blogs.json', blogs)

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
