import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Add cache control headers to prevent caching
    const promotions = await readDataFile('promotions.json')
    const activePromotions = promotions.filter((p: any) => p && p.active === true)
    
    const response = NextResponse.json(activePromotions)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const promotion = await request.json()
    console.log('📝 Creating promotion:', promotion)
    
    // Validate required fields
    if (!promotion.text || !promotion.link) {
      console.error('❌ Validation failed: text and link are required')
      return NextResponse.json(
        { error: 'Text and link are required fields' },
        { status: 400 }
      )
    }
    
    const promotions = await readDataFile('promotions.json')
    console.log(`📊 Current promotions count: ${promotions.length}`)
    
    // Generate new ID
    const maxId = promotions.length > 0 
      ? Math.max(...promotions.map((p: any) => p.id || 0)) 
      : 0
    
    const newPromotion = {
      ...promotion,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      active: promotion.active !== undefined ? promotion.active : true,
    }

    console.log(`🆕 New promotion ID: ${newPromotion.id}`)
    promotions.push(newPromotion)
    
    await writeDataFile('promotions.json', promotions)
    console.log(`✅ Promotion created successfully: ${newPromotion.id}`)

    return NextResponse.json(newPromotion, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating promotion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
