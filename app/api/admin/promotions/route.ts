import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'

// Admin route to get all promotions (including inactive)
export async function GET() {
  try {
    const promotions = await readDataFile('promotions.json')
    return NextResponse.json(promotions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}
