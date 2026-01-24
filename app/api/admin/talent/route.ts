import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Admin route to get all talents (including unpublished)
export async function GET() {
  try {
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: talents, error } = await supabase
            .from('talent')
            .select('*')
            .order('rating', { ascending: false })
          
          if (!error && talents) {
            // Sort by rating (highest first), then by creation date
            const talentsData = talents as any[]
            talentsData.sort((a: any, b: any) => {
              if ((b.rating || 0) !== (a.rating || 0)) {
                return (b.rating || 0) - (a.rating || 0)
              }
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            })
            
            // Ensure projectsCompleted is set for all talents
            const talentsWithDefaults = talentsData.map((t: any) => ({
              ...t,
              projectsCompleted: t.projectsCompleted ?? 0,
            }))
            
            const response = NextResponse.json(talentsWithDefaults)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            response.headers.set('Pragma', 'no-cache')
            response.headers.set('Expires', '0')
            return response
          }
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const talents = await readDataFile('talent.json')
    // Sort by rating (highest first), then by creation date
    talents.sort((a: any, b: any) => {
      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0)
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
    
    // Ensure projectsCompleted is set for all talents
    const talentsWithDefaults = talents.map((t: any) => ({
      ...t,
      projectsCompleted: t.projectsCompleted ?? 0,
    }))
    
    const response = NextResponse.json(talentsWithDefaults)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('❌ Error fetching talents for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch talents' },
      { status: 500 }
    )
  }
}
