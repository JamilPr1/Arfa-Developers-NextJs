import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'lib', 'data')

// Ensure data directory exists
if (typeof window === 'undefined') {
  // Only run on server side
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(dataDir, filename)
    if (!fs.existsSync(filePath)) {
      // Return empty array if file doesn't exist
      return []
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(fileContents)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

export async function writeDataFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    const filePath = path.join(dataDir, filename)
    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    // Write with proper formatting
    const content = JSON.stringify(data, null, 2)
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}
