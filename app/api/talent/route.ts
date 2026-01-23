import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const talents = await readDataFile('talent.json')
    // Return only published talents for public API
    const publishedTalents = talents.filter((t: any) => t && t.published === true)
    
    // Sort by rating (highest first)
    publishedTalents.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    
    const response = NextResponse.json(publishedTalents)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching talents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch talents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const talent = await request.json()
    console.log('📝 Creating talent:', talent)
    
    // Validate required fields
    if (!talent.name || !talent.skills || !talent.hourlyRate) {
      console.error('❌ Validation failed: name, skills, and hourlyRate are required')
      return NextResponse.json(
        { error: 'Name, skills, and hourly rate are required fields' },
        { status: 400 }
      )
    }
    
    const talents = await readDataFile('talent.json')
    console.log(`📊 Current talents count: ${talents.length}`)
    
    // Generate new ID
    const maxId = talents.length > 0 
      ? Math.max(...talents.map((t: any) => t.id || 0)) 
      : 0
    
    const newTalent = {
      ...talent,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      published: talent.published !== undefined ? talent.published : true,
      rating: talent.rating || 0,
      projectsCompleted: talent.projectsCompleted || 0,
    }

    console.log(`🆕 New talent ID: ${newTalent.id}`)
    talents.push(newTalent)
    
    await writeDataFile('talent.json', talents)
    console.log(`✅ Talent created successfully: ${newTalent.id}`)

    return NextResponse.json(newTalent, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating talent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create talent' },
      { status: 500 }
    )
  }
}
