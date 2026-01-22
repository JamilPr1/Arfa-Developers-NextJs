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
    const promotions = await readDataFile('promotions.json')
    
    const newPromotion = {
      ...promotion,
      id: promotions.length > 0 ? Math.max(...promotions.map((p: any) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    }

    promotions.push(newPromotion)
    await writeDataFile('promotions.json', promotions)

    return NextResponse.json(newPromotion, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
