import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updatedPromotion = await request.json()
    const promotions = await readDataFile('promotions.json')
    
    const index = promotions.findIndex((p: any) => p.id === parseInt(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    const existingPromotion = promotions[index] as any
    promotions[index] = {
      ...existingPromotion,
      ...updatedPromotion,
      id: parseInt(id),
    }

    await writeDataFile('promotions.json', promotions)
    return NextResponse.json(promotions[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const promotions = await readDataFile('promotions.json')
    const filteredPromotions = promotions.filter((p: any) => p.id !== parseInt(id))

    await writeDataFile('promotions.json', filteredPromotions)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}
