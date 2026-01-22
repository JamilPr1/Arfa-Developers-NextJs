import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET() {
  try {
    const promotions = await readDataFile('promotions.json')
    const activePromotions = promotions.filter((p: any) => p.active)
    return NextResponse.json(activePromotions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const promotion = await request.json()
    
    // Validate required fields
    if (!promotion.text || !promotion.link) {
      return NextResponse.json(
        { error: 'Text and link are required fields' },
        { status: 400 }
      )
    }
    
    const promotions = await readDataFile('promotions.json')
    
    const newPromotion = {
      ...promotion,
      id: promotions.length > 0 ? Math.max(...promotions.map((p: any) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      active: promotion.active !== undefined ? promotion.active : true,
    }

    promotions.push(newPromotion)
    await writeDataFile('promotions.json', promotions)

    return NextResponse.json(newPromotion, { status: 201 })
  } catch (error: any) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
