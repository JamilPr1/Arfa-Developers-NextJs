import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Admin route to get all talents (including unpublished)
export async function GET() {
  try {
    const talents = await readDataFile('talent.json')
    // Sort by rating (highest first), then by creation date
    talents.sort((a: any, b: any) => {
      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0)
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
    
    const response = NextResponse.json(talents)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching talents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch talents' },
      { status: 500 }
    )
  }
}
