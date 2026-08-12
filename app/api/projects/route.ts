import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { insertDataToSupabase } from '@/lib/supabaseDataUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Prefer local projects.json for marketing accuracy (images + copy)
    try {
      const projects = await readDataFile('projects.json')
      const publishedProjects = (projects || []).filter((p: any) => p.published)
      if (publishedProjects.length > 0) {
        const response = NextResponse.json(publishedProjects)
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        return response
      }
    } catch {
      // continue to Supabase
    }

    // Try Supabase if local file empty
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('id', { ascending: false })
          
          if (!error && projects && projects.length > 0) {
            const response = NextResponse.json(projects)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
      }
    }
    
    const response = NextResponse.json([])
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json()
    
    const newProject = {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const created = await insertDataToSupabase('projects', newProject)
        console.log(`✅ Project created successfully in Supabase: ${created.id}`)
        return NextResponse.json(created, { status: 201 })
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const projects = await readDataFile('projects.json')
    
    const maxId = projects.length > 0 
      ? Math.max(...projects.map((p: any) => p.id || 0)) 
      : 0
    
    const projectWithId = {
      ...newProject,
      id: maxId + 1,
    }

    projects.push(projectWithId)
    await writeDataFile('projects.json', projects)
    console.log(`✅ Project created successfully: ${projectWithId.id}`)

    return NextResponse.json(projectWithId, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
