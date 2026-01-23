import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const talents = await readDataFile('talent.json')
    const talent = talents.find((t: any) => t.id === parseInt(id))
    
    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(talent)
  } catch (error: any) {
    console.error('Error fetching talent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch talent' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    console.log(`📝 Updating talent ${id}:`, updates)
    
    const talents = await readDataFile('talent.json')
    const index = talents.findIndex((t: any) => t.id === parseInt(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }
    
    const existingTalent = talents[index] as any
    talents[index] = {
      ...existingTalent,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    await writeDataFile('talent.json', talents)
    console.log(`✅ Talent updated successfully: ${id}`)
    
    return NextResponse.json(talents[index])
  } catch (error: any) {
    console.error('❌ Error updating talent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update talent' },
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
    console.log(`🗑️ Deleting talent ${id}`)
    
    const talents = await readDataFile('talent.json')
    const filtered = talents.filter((t: any) => t.id !== parseInt(id))
    
    if (talents.length === filtered.length) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }
    
    await writeDataFile('talent.json', filtered)
    console.log(`✅ Talent deleted successfully: ${id}`)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error deleting talent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete talent' },
      { status: 500 }
    )
  }
}
