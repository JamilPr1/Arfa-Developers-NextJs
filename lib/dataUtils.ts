// Data storage: Supabase (primary), Upstash Redis (fallback), file system (local dev)
import fs from 'fs'
import path from 'path'
import { readDataFromSupabase, writeDataToSupabase } from './supabaseDataUtils'

const dataDir = path.join(process.cwd(), 'lib', 'data')

// Map JSON filenames to Supabase table names
const tableMap: Record<string, string> = {
  'projects.json': 'projects',
  'blogs.json': 'blogs',
  'promotions.json': 'promotions',
  'talent.json': 'talent',
}

// Check if Redis is available
const isRedisAvailable = () => {
  try {
    // Upstash Redis uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
    // Vercel KV uses KV_REST_API_URL and KV_REST_API_TOKEN
    return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
           !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  } catch {
    return false
  }
}

// Lazy load Redis
let redis: any = null
let redisLoadAttempted = false

const getRedis = async () => {
  if (redis) return redis
  if (redisLoadAttempted) return null
  redisLoadAttempted = true
  
  if (isRedisAvailable()) {
    try {
      const { Redis } = await import('@upstash/redis')
      redis = Redis.fromEnv()
      console.log('✅ Redis initialized successfully')
      return redis
    } catch (error: any) {
      console.warn('⚠️ Redis module not available:', error?.message)
      return null
    }
  }
  console.log('ℹ️ Redis not configured (missing env vars)')
  return null
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  console.log(`📖 Reading ${filename}...`)
  
  // During build time (static generation), skip Redis and use filesystem
  // Redis is only available at runtime in serverless functions
  // Check for build phase or if we're in a static generation context
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-development-build' ||
                      (typeof process.env.VERCEL === 'undefined' && typeof window === 'undefined')
  
  try {
    // Try Redis first (only at runtime, not during build)
    if (!isBuildTime) {
      const redisInstance = await getRedis()
      if (redisInstance) {
        try {
          const data = (await redisInstance.get(filename)) as T[] | null | undefined
          if (data !== null && data !== undefined) {
            console.log(`✅ Read ${data.length} items from Redis for ${filename}`)
            return Array.isArray(data) ? data : []
          }
          console.log(`ℹ️ Redis returned null/undefined for ${filename}, trying file system`)
        } catch (redisError: any) {
          // Check if error is related to build-time restrictions
          const isBuildError = redisError?.message?.includes('Dynamic server usage') ||
                               redisError?.message?.includes('no-store')
          if (isBuildError) {
            console.log(`ℹ️ Redis not available during build for ${filename}, using file system`)
          } else {
            console.error(`❌ Redis read error for ${filename}:`, redisError?.message)
          }
        }
      }
    } else {
      console.log(`ℹ️ Build time detected, using file system for ${filename}`)
    }

    // Fallback to file system (local dev only)
    if (typeof window === 'undefined') {
      try {
        const filePath = path.join(dataDir, filename)
        if (fs.existsSync(filePath)) {
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const parsed = JSON.parse(fileContents)
          const data = Array.isArray(parsed) ? parsed : []
          console.log(`✅ Read ${data.length} items from file system for ${filename}`)
          return data
        }
        console.log(`ℹ️ File not found: ${filePath}`)
      } catch (fsError: any) {
        console.error(`❌ File read error for ${filename}:`, fsError?.message)
      }
    }

    console.log(`⚠️ No data found for ${filename}, returning empty array`)
    return []
  } catch (error: any) {
    console.error(`❌ Error reading ${filename}:`, error?.message || error)
    return []
  }
}

export async function writeDataFile<T>(filename: string, data: T[]): Promise<void> {
  console.log(`💾 Writing ${data.length} items to ${filename}...`)
  
  const tableName = tableMap[filename]
  const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
  
  try {
    // Try Supabase first (if configured and not during build)
    // Be extra defensive - check env vars and build time
    const isBuildTimeCheck = process.env.NEXT_PHASE === 'phase-production-build' || 
                             process.env.NEXT_PHASE === 'phase-development-build' ||
                             process.env.CI === 'true'
    
    if (!isBuildTimeCheck && 
        tableName && 
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        await writeDataToSupabase(tableName, data as any[])
        console.log(`✅ Successfully wrote ${filename} to Supabase`)
        return
      } catch (supabaseError: any) {
        // Silently fail - never throw during build
        // Continue to fallback
      }
    }
    
    // Fallback to Redis
    const redisInstance = await getRedis()
    if (redisInstance) {
      try {
        await redisInstance.set(filename, data)
        console.log(`✅ Successfully wrote ${filename} to Redis`)
        return
      } catch (redisError: any) {
        console.error(`❌ Redis write error for ${filename}:`, redisError?.message)
        // Continue to fallback
      }
    }

    // If in production and neither Supabase nor Redis is available, throw error
    if (isProduction) {
      const errorMsg = `❌ No storage configured. Please set up Supabase or Redis:
1. Supabase: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Or Redis: Go to Vercel Dashboard → Storage → Create KV Database

Current env check:
- NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
- UPSTASH_REDIS_REST_URL: ${process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing'}`
      console.error(errorMsg)
      throw new Error('No storage configured. Please set up Supabase or Redis. See server logs for details.')
    }

    // Fallback to file system (local dev only)
    if (typeof window === 'undefined') {
      try {
        const filePath = path.join(dataDir, filename)
        const dir = path.dirname(filePath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        const content = JSON.stringify(data, null, 2)
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`✅ Successfully wrote ${filename} to file system`)
        return
      } catch (fsError: any) {
        if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
          console.error(`❌ Filesystem is read-only for ${filename} (${fsError.code})`)
          throw new Error(`Cannot write to read-only filesystem. Please configure Supabase or Redis. Error: ${fsError.message}`)
        }
        throw new Error(`File write failed: ${fsError.message}`)
      }
    }

    throw new Error('Cannot write: No storage configured and filesystem not available')
  } catch (error: any) {
    console.error(`❌ Error writing ${filename}:`, error?.message || error)
    throw error
  }
}
