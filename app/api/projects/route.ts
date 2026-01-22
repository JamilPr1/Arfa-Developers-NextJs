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
    
    const newProject = {
      ...project,
      id: projects.length > 0 ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.push(newProject)
    await writeDataFile('projects.json', projects)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
