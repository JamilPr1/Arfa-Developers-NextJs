import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updatedPromotion = await request.json()
    console.log(`📝 Updating promotion ${id}:`, updatedPromotion)
    
    const promotions = await readDataFile('promotions.json')
    console.log(`📊 Current promotions count: ${promotions.length}`)
    
    const index = promotions.findIndex((p: any) => p.id === parseInt(id))
    
    if (index === -1) {
      console.error(`❌ Promotion ${id} not found`)
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
    console.log(`✅ Promotion ${id} updated successfully`)

    return NextResponse.json(promotions[index])
  } catch (error: any) {
    console.error(`❌ Error updating promotion:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to update promotion' },
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
    console.log(`🗑️ Deleting promotion ${id}`)
    
    const promotions = await readDataFile('promotions.json')
    console.log(`📊 Current promotions count: ${promotions.length}`)
    
    const filteredPromotions = promotions.filter((p: any) => p.id !== parseInt(id))
    
    if (filteredPromotions.length === promotions.length) {
      console.error(`❌ Promotion ${id} not found`)
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    await writeDataFile('promotions.json', filteredPromotions)
    console.log(`✅ Promotion ${id} deleted successfully. New count: ${filteredPromotions.length}`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`❌ Error deleting promotion:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}
