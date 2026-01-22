import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'

// Admin route to get all blogs (including unpublished)
export async function GET() {
  try {
    const blogs = await readDataFile('blogs.json')
    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
