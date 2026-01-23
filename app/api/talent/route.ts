import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { insertDataToSupabase, readDataFromSupabase } from '@/lib/supabaseDataUtils'
import { getSupabaseClient } from '@/lib/supabase'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Try Supabase first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = getSupabaseClient()
        if (supabase) {
          const { data: talents, error } = await supabase
            .from('talent')
            .select('*')
            .eq('published', true)
            .order('rating', { ascending: false })
          
          if (!error && talents) {
            const response = NextResponse.json(talents)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase read error, falling back:', supabaseError?.message)
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    const publishedTalents = talents.filter((t: any) => t && t.published === true)
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
    
    const newTalent = {
      ...talent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: talent.published !== undefined ? talent.published : true,
      rating: talent.rating || 0,
      projectsCompleted: talent.projectsCompleted || 0,
    }

    // Try Supabase first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const created = await insertDataToSupabase('talent', newTalent)
        console.log(`✅ Talent created successfully in Supabase: ${created.id}`)
        return NextResponse.json(created, { status: 201 })
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase insert error, falling back:', supabaseError?.message)
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    const maxId = talents.length > 0 
      ? Math.max(...talents.map((t: any) => t.id || 0)) 
      : 0
    
    const talentWithId = {
      ...newTalent,
      id: maxId + 1,
    }

    talents.push(talentWithId)
    await writeDataFile('talent.json', talents)
    console.log(`✅ Talent created successfully: ${talentWithId.id}`)

    return NextResponse.json(talentWithId, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating talent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create talent' },
      { status: 500 }
    )
  }
}
