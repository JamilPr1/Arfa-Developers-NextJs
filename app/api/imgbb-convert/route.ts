import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * API endpoint to convert ImgBB page URLs to direct image URLs
 * This fetches the ImgBB page and extracts the direct image URL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageUrl = searchParams.get('url')
    
    if (!pageUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }
    
    // Check if it's an ImgBB URL
    if (!pageUrl.includes('ibb.co/')) {
      return NextResponse.json(
        { directUrl: pageUrl },
        { status: 200 }
      )
    }
    
    try {
      // Fetch the ImgBB page
      const response = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`)
      }
      
      const html = await response.text()
      
      // Try to extract direct image URL from various patterns
      // ImgBB typically includes the image in meta tags or as a direct link
      const patterns = [
        /<meta\s+property="og:image"\s+content="([^"]+)"/i,
        /<img[^>]+src="([^"]*i\.ibb\.co[^"]+)"/i,
        /https:\/\/i\.ibb\.co\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif|webp)/i,
      ]
      
      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
          const directUrl = match[1]
          console.log(`✅ Converted ImgBB URL: ${pageUrl} -> ${directUrl}`)
          return NextResponse.json({ directUrl })
        }
      }
      
      // If no pattern matched, return the original URL
      console.log(`⚠️ Could not extract direct URL from: ${pageUrl}`)
      return NextResponse.json({ directUrl: pageUrl })
      
    } catch (fetchError: any) {
      console.error('Error fetching ImgBB page:', fetchError)
      // Return original URL if fetch fails
      return NextResponse.json({ directUrl: pageUrl })
    }
    
  } catch (error: any) {
    console.error('Error converting ImgBB URL:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to convert URL' },
      { status: 500 }
    )
  }
}
