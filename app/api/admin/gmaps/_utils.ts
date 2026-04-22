import { NextRequest } from 'next/server'

export function requireRunnerSecret(req: NextRequest) {
  const expected = process.env.GMAPS_RUNNER_SECRET || process.env.AI_AUTOMATION_SECRET || process.env.LEADS_IMPORT_SECRET || ''
  if (!expected) return

  const provided =
    req.headers.get('x-runner-secret') ||
    req.headers.get('x-admin-secret') ||
    req.headers.get('x-import-secret') ||
    req.nextUrl.searchParams.get('secret') ||
    ''

  if (provided !== expected) throw new Error('Unauthorized')
}

