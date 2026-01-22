import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'lib', 'data')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(dataDir, filename)
    if (!fs.existsSync(filePath)) {
      // Return empty array if file doesn't exist
      return []
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
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
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}
