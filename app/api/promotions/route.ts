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

    promotions.push(newPromotion)
    
    try {
      await writeDataFile('promotions.json', promotions)
      console.log('Promotion created successfully:', newPromotion.id)
    } catch (writeError: any) {
      console.error('Write error:', writeError)
      // If write fails but we're in memory store, still return success
      // The data is in memory and will work for this session
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }

    return NextResponse.json(newPromotion, { status: 201 })
  } catch (error: any) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion. Please configure Vercel KV for persistent storage.' },
      { status: 500 }
    )
  }
}
