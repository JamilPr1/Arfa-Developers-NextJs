import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get the secret token from environment variable or query param
    const secret = request.headers.get('x-revalidate-secret') || 
                   request.nextUrl.searchParams.get('secret') ||
                   (await request.json().catch(() => ({}))).secret
    
    const expectedSecret = process.env.REVALIDATE_SECRET || 'your-secret-key-change-this'

    // Verify secret token for security (allow if no secret is set for easier setup)
    if (expectedSecret && expectedSecret !== 'your-secret-key-change-this' && secret !== expectedSecret) {
      return NextResponse.json(
        { revalidated: false, error: 'Invalid secret token' },
        { status: 401 }
      )
    }

    // Get the path to revalidate (optional, defaults to root)
    const body = await request.json().catch(() => ({}))
    const path = body.path || request.nextUrl.searchParams.get('path') || '/'
    const tag = body.tag || request.nextUrl.searchParams.get('tag')

    // Revalidate by tag if provided, otherwise by path
    if (tag) {
      revalidateTag(tag)
      console.log(`[Revalidate] Successfully revalidated tag: ${tag}`)
    } else {
      revalidatePath(path)
      console.log(`[Revalidate] Successfully revalidated path: ${path}`)
    }

    return NextResponse.json({
      revalidated: true,
      path: tag ? undefined : path,
      tag: tag || undefined,
      timestamp: new Date().toISOString(),
      message: 'Cache cleared successfully. Changes should reflect on live site within seconds.',
    })
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    return NextResponse.json(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret')
    const path = request.nextUrl.searchParams.get('path') || '/'
    const tag = request.nextUrl.searchParams.get('tag')
    
    const expectedSecret = process.env.REVALIDATE_SECRET || 'your-secret-key-change-this'

    if (expectedSecret && expectedSecret !== 'your-secret-key-change-this' && secret !== expectedSecret) {
      return NextResponse.json(
        { revalidated: false, error: 'Invalid secret token' },
        { status: 401 }
      )
    }

    if (tag) {
      revalidateTag(tag)
      console.log(`[Revalidate] Successfully revalidated tag: ${tag}`)
    } else {
      revalidatePath(path)
      console.log(`[Revalidate] Successfully revalidated path: ${path}`)
    }

    return NextResponse.json({
      revalidated: true,
      path: tag ? undefined : path,
      tag: tag || undefined,
      timestamp: new Date().toISOString(),
      message: 'Cache cleared successfully.',
    })
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    return NextResponse.json(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
