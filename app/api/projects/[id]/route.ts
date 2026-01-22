import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projects = await readDataFile('projects.json')
    const project = projects.find((p: any) => p.id === parseInt(id))

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
    const updatedProject = await request.json()
    const projects = await readDataFile('projects.json')
    
    const index = projects.findIndex((p: any) => p.id === parseInt(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const existingProject = projects[index] as any
    projects[index] = {
      ...existingProject,
      ...updatedProject,
      id: parseInt(id),
      updatedAt: new Date().toISOString(),
    }

    try {
      await writeDataFile('projects.json', projects)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }
    return NextResponse.json(projects[index])
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project. Please configure Vercel KV for persistent storage.' },
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
    const projects = await readDataFile('projects.json')
    const filteredProjects = projects.filter((p: any) => p.id !== parseInt(id))

    try {
      await writeDataFile('projects.json', filteredProjects)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete project. Please configure Vercel KV for persistent storage.' },
      { status: 500 }
    )
  }
}
