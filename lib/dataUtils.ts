// Simplified data storage: Upstash Redis for production, file system for local dev
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'lib', 'data')

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
  
  try {
    // Try Redis first
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
        console.error(`❌ Redis read error for ${filename}:`, redisError?.message)
      }
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
  
  // Check if we're in production (Vercel)
  const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
  
  try {
    // Try Redis first
    const redisInstance = await getRedis()
    if (redisInstance) {
      try {
        await redisInstance.set(filename, data)
        console.log(`✅ Successfully wrote ${filename} to Redis`)
        return
      } catch (redisError: any) {
        console.error(`❌ Redis write error for ${filename}:`, redisError?.message)
        throw new Error(`Redis write failed: ${redisError?.message}`)
      }
    }

    // If in production and Redis is not available, throw clear error
    if (isProduction) {
      const errorMsg = `❌ Upstash Redis is not configured. Please set up Redis in your dashboard:
1. Go to Vercel Dashboard → Storage
2. Create a KV Database (Upstash Redis)
3. Link it to your project
4. Run: vercel env pull .env.development.local

Current env check:
- UPSTASH_REDIS_REST_URL: ${process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing'}
- UPSTASH_REDIS_REST_TOKEN: ${process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Set' : '❌ Missing'}
- KV_REST_API_URL: ${process.env.KV_REST_API_URL ? '✅ Set (legacy)' : '❌ Missing'}
- KV_REST_API_TOKEN: ${process.env.KV_REST_API_TOKEN ? '✅ Set (legacy)' : '❌ Missing'}`
      console.error(errorMsg)
      throw new Error('Upstash Redis is not configured. Please set up Redis storage in Vercel dashboard. See server logs for details.')
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
          throw new Error(`Cannot write to read-only filesystem. Please configure Upstash Redis. Error: ${fsError.message}`)
        }
        throw new Error(`File write failed: ${fsError.message}`)
      }
    }

    throw new Error('Cannot write: Redis not configured and filesystem not available')
  } catch (error: any) {
    console.error(`❌ Error writing ${filename}:`, error?.message || error)
    throw error
  }
}
