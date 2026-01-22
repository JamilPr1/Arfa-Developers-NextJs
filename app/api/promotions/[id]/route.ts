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

    try {
      await writeDataFile('promotions.json', promotions)
      console.log('Promotion updated successfully:', id)
    } catch (writeError: any) {
      console.error('Write error:', writeError)
      // If write fails but we're in memory store, still return success
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }

    return NextResponse.json(promotions[index])
  } catch (error: any) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update promotion. Please configure Vercel KV for persistent storage.' },
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
