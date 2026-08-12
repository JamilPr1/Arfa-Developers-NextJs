import projectsJson from '@/lib/data/projects.json'

export type ProjectRecord = {
  id: number
  title: string
  type: string
  image: string
  url?: string
  tech: string[]
  description: string
  fullDescription?: string
  published?: boolean
  createdAt?: string
  updatedAt?: string
}

/** Canonical marketing portfolio — bundled at build time (no Redis/Supabase lag). */
export const PROJECTS: ProjectRecord[] = Array.isArray(projectsJson)
  ? (projectsJson as ProjectRecord[])
  : []

export function getPublishedProjects(): ProjectRecord[] {
  return PROJECTS.filter((p) => p.published !== false)
}
