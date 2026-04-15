import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Normalize pathname
  const pathname = url.pathname.toLowerCase()

  // Check spam paths
  const isSpamPath = pathname === '/hidey.php' || pathname === '/content.php'

  // Check spam query params
  const hasSpamQuery = url.searchParams.has('j') || url.searchParams.has('g')

  if (isSpamPath || hasSpamQuery) {
    return new NextResponse('Gone', { status: 410 })
  }

  return NextResponse.next()
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
}

