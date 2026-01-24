import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { updateDataInSupabase, deleteDataFromSupabase } from '@/lib/supabaseDataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const talentId = parseInt(id)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: talent, error } = await supabase
            .from('talent')
            .select('*')
            .eq('id', talentId)
            .single()
          
          if (!error && talent) {
            // Ensure projectsCompleted is set
            const talentWithDefaults = {
              ...talent,
              projectsCompleted: talent.projectsCompleted ?? 0,
            }
            return NextResponse.json(talentWithDefaults)
          }
          // Silently continue to fallback
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    const talent = talents.find((t: any) => t.id === talentId)
    
    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }
    
    // Ensure projectsCompleted is set
    const talentWithDefaults = {
      ...talent,
      projectsCompleted: talent.projectsCompleted ?? 0,
    }
    
    return NextResponse.json(talentWithDefaults)
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
    
    const talentId = parseInt(id)
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    // Try Supabase first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const updated = await updateDataInSupabase('talent', talentId, updatesWithTimestamp)
        console.log(`✅ Talent updated successfully in Supabase: ${id}`)
        return NextResponse.json(updated)
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Talent not found' },
            { status: 404 }
          )
        }
        console.warn('⚠️ Supabase update error, falling back:', supabaseError?.message)
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    const index = talents.findIndex((t: any) => t.id === talentId)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      )
    }
    
    const existingTalent = talents[index] as any
    talents[index] = {
      ...existingTalent,
      ...updatesWithTimestamp,
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
    const talentId = parseInt(id)
    console.log(`🗑️ Deleting talent ${id}`)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        await deleteDataFromSupabase('talent', talentId)
        console.log(`✅ Talent deleted successfully from Supabase: ${id}`)
        return NextResponse.json({ success: true })
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Talent not found' },
            { status: 404 }
          )
        }
        // Silently continue to fallback
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    const filtered = talents.filter((t: any) => t.id !== talentId)
    
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
