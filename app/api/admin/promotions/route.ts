import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Admin route to get all promotions (including inactive)
export async function GET(request: NextRequest) {
  try {
    const promotions = await readDataFile('promotions.json')
    
    // Add cache control headers to prevent caching
    const response = NextResponse.json(promotions)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching promotions for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}
