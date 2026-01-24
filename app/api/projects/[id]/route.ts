import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { deleteDataFromSupabase, updateDataInSupabase } from '@/lib/supabaseDataUtils'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()
          
          if (!error && project) {
            return NextResponse.json(project)
          }
          // Silently continue to fallback
        }
      } catch (supabaseError: any) {
        // Silently fail - never throw
        // Continue to fallback
      }
    }
    
    // Fallback to file-based system
    const projects = await readDataFile('projects.json')
    const project = projects.find((p: any) => p.id === projectId)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
    const projectId = parseInt(id)
    const updatedProject = await request.json()
    
    const updatesWithTimestamp = {
      ...updatedProject,
      id: projectId,
      updatedAt: new Date().toISOString(),
    }
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        const updated = await updateDataInSupabase('projects', projectId, updatesWithTimestamp)
        console.log(`✅ Project updated successfully in Supabase: ${id}`)
        return NextResponse.json(updated)
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
          )
        }
        // Silently continue to fallback
      }
    }
    
    // Fallback to file-based system
    const projects = await readDataFile('projects.json')
    const index = projects.findIndex((p: any) => p.id === projectId)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const existingProject = projects[index] as any
    projects[index] = {
      ...existingProject,
      ...updatesWithTimestamp,
    }

    await writeDataFile('projects.json', projects)
    console.log(`✅ Project updated successfully: ${id}`)
    return NextResponse.json(projects[index])
  } catch (error: any) {
    console.error('❌ Error updating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
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
    const projectId = parseInt(id)
    console.log(`🗑️ Deleting project ${id}`)
    
    // Try Supabase first (only if env vars are set and not during build)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build') {
      try {
        await deleteDataFromSupabase('projects', projectId)
        console.log(`✅ Project deleted successfully from Supabase: ${id}`)
        
        // Revalidate cache
        try {
          revalidatePath('/portfolio')
          revalidatePath('/api/projects')
          revalidatePath('/api/admin/projects')
        } catch (revalidateError) {
          console.warn('Cache revalidation warning:', revalidateError)
        }
        
        return NextResponse.json({ success: true })
      } catch (supabaseError: any) {
        if (supabaseError.message?.includes('not found')) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
          )
        }
        // Silently continue to fallback
      }
    }
    
    // Fallback to file-based system
    const projects = await readDataFile('projects.json')
    const filteredProjects = projects.filter((p: any) => p.id !== projectId)
    
    if (projects.length === filteredProjects.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await writeDataFile('projects.json', filteredProjects)
    console.log(`✅ Project deleted successfully: ${id}`)
    
    // Revalidate cache
    try {
      revalidatePath('/portfolio')
      revalidatePath('/api/projects')
      revalidatePath('/api/admin/projects')
    } catch (revalidateError) {
      console.warn('Cache revalidation warning:', revalidateError)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error deleting project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    )
  }
}
