import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export async function GET() {
  try {
    const projects = await readDataFile('projects.json')
    const publishedProjects = projects.filter((p: any) => p.published)
    return NextResponse.json(publishedProjects)
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
    const projects = await readDataFile('projects.json')
    
    const maxId = projects.length > 0 
      ? Math.max(...projects.map((p: any) => p.id || 0)) 
      : 0
    
    const newProject = {
      ...project,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.push(newProject)
    
    try {
      await writeDataFile('projects.json', projects)
    } catch (writeError: any) {
      if (writeError.message?.includes('memory store')) {
        console.warn('Using memory store - data will not persist')
      } else {
        throw writeError
      }
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project. Please configure Vercel KV for persistent storage.' },
      { status: 500 }
    )
  }
}
