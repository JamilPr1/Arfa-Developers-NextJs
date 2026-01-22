// Use KV (Redis) for production, fallback to file system for local dev
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'lib', 'data')

// Check if KV is available (Vercel production)
const isKvAvailable = () => {
  try {
    return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
  } catch {
    return false
  }
}

// Lazy load KV to avoid errors if not configured
let kv: any = null
const getKv = async () => {
  if (kv) return kv
  if (isKvAvailable()) {
    try {
      const kvModule = await import('@vercel/kv')
      kv = kvModule.kv
      return kv
    } catch (error) {
      console.warn('KV module not available:', error)
      return null
    }
  }
  return null
}

// Fallback to in-memory storage if neither KV nor filesystem works
const memoryStore: Record<string, any[]> = {
  'projects.json': [],
  'blogs.json': [],
  'promotions.json': [],
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  try {
    // Try KV first (production)
    const kvInstance = await getKv()
    if (kvInstance) {
      try {
        const data = await kvInstance.get<T[]>(filename)
        if (data !== null && data !== undefined) {
          return Array.isArray(data) ? data : []
        }
      } catch (kvError: any) {
        console.warn(`KV read failed for ${filename}, trying fallback:`, kvError?.message)
      }
    }

    // Fallback to file system (local development)
    if (typeof window === 'undefined') {
      try {
        const filePath = path.join(dataDir, filename)
        if (fs.existsSync(filePath)) {
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const parsed = JSON.parse(fileContents)
          return Array.isArray(parsed) ? parsed : []
        }
      } catch (fsError: any) {
        console.warn(`File read failed for ${filename}:`, fsError?.message)
      }
    }

    // Final fallback to memory store
    return Array.isArray(memoryStore[filename]) ? memoryStore[filename] : []
  } catch (error: any) {
    console.error(`Error reading ${filename}:`, error?.message || error)
    return []
  }
}

export async function writeDataFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    // Try KV first (production)
    const kvInstance = await getKv()
    if (kvInstance) {
      try {
        await kvInstance.set(filename, data)
        console.log(`Successfully wrote ${filename} to KV`)
        return // Success, exit early
      } catch (kvError: any) {
        console.warn(`KV write failed for ${filename}, trying fallback:`, kvError?.message)
      }
    }

    // Fallback to file system (local development)
    if (typeof window === 'undefined') {
      try {
        const filePath = path.join(dataDir, filename)
        const dir = path.dirname(filePath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        const content = JSON.stringify(data, null, 2)
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`Successfully wrote ${filename} to file system`)
        return // Success, exit early
      } catch (fsError: any) {
        // If filesystem is read-only (Vercel), fall through to memory store
        if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
          console.warn(`Filesystem is read-only for ${filename} (${fsError.code}), using memory store`)
        } else {
          throw fsError
        }
      }
    }

    // Final fallback to memory store (temporary, won't persist)
    memoryStore[filename] = data
    console.warn(`⚠️ Using in-memory storage for ${filename}. Data will NOT persist across deployments. Please configure Vercel KV.`)
  } catch (error: any) {
    console.error(`Error writing ${filename}:`, error?.message || error)
    throw error
  }
}
