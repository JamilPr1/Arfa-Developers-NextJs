// Simplified data storage: KV for production, file system for local dev
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'lib', 'data')

// Check if KV is available
const isKvAvailable = () => {
  try {
    return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
  } catch {
    return false
  }
}

// Lazy load KV
let kv: any = null
let kvLoadAttempted = false

const getKv = async () => {
  if (kv) return kv
  if (kvLoadAttempted) return null
  kvLoadAttempted = true
  
  if (isKvAvailable()) {
    try {
      const kvModule = await import('@vercel/kv')
      kv = kvModule.kv
      console.log('✅ KV initialized successfully')
      return kv
    } catch (error: any) {
      console.warn('⚠️ KV module not available:', error?.message)
      return null
    }
  }
  console.log('ℹ️ KV not configured (missing env vars)')
  return null
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  console.log(`📖 Reading ${filename}...`)
  
  try {
    // Try KV first
    const kvInstance = await getKv()
    if (kvInstance) {
      try {
        const data = (await kvInstance.get(filename)) as T[] | null | undefined
        if (data !== null && data !== undefined) {
          console.log(`✅ Read ${data.length} items from KV for ${filename}`)
          return Array.isArray(data) ? data : []
        }
        console.log(`ℹ️ KV returned null/undefined for ${filename}, trying file system`)
      } catch (kvError: any) {
        console.error(`❌ KV read error for ${filename}:`, kvError?.message)
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
    // Try KV first
    const kvInstance = await getKv()
    if (kvInstance) {
      try {
        await kvInstance.set(filename, data)
        console.log(`✅ Successfully wrote ${filename} to KV`)
        return
      } catch (kvError: any) {
        console.error(`❌ KV write error for ${filename}:`, kvError?.message)
        throw new Error(`KV write failed: ${kvError?.message}`)
      }
    }

    // If in production and KV is not available, throw clear error
    if (isProduction) {
      const errorMsg = `❌ Vercel KV is not configured. Please set up Vercel KV in your dashboard:
1. Go to Vercel Dashboard → Storage
2. Create a KV Database (Upstash KV)
3. Link it to your project
4. Environment variables will be added automatically

Current env check:
- KV_REST_API_URL: ${process.env.KV_REST_API_URL ? '✅ Set' : '❌ Missing'}
- KV_REST_API_TOKEN: ${process.env.KV_REST_API_TOKEN ? '✅ Set' : '❌ Missing'}`
      console.error(errorMsg)
      throw new Error('Vercel KV is not configured. Please set up KV storage in Vercel dashboard. See server logs for details.')
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
          throw new Error(`Cannot write to read-only filesystem. Please configure Vercel KV. Error: ${fsError.message}`)
        }
        throw new Error(`File write failed: ${fsError.message}`)
      }
    }

    throw new Error('Cannot write: KV not configured and filesystem not available')
  } catch (error: any) {
    console.error(`❌ Error writing ${filename}:`, error?.message || error)
    throw error
  }
}
