import { kv } from '@vercel/kv'

// Fallback to in-memory storage if KV is not configured
const memoryStore: Record<string, any[]> = {
  'projects.json': [],
  'blogs.json': [],
  'promotions.json': [],
}

// Check if KV is available
const isKvAvailable = () => {
  try {
    return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN
  } catch {
    return false
  }
}

export async function readDataFile<T>(filename: string): Promise<T[]> {
  try {
    if (isKvAvailable()) {
      const data = await kv.get<T[]>(filename)
      return Array.isArray(data) ? data : []
    } else {
      // Fallback to memory store for local development
      return Array.isArray(memoryStore[filename]) ? memoryStore[filename] : []
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

export async function writeDataFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    if (isKvAvailable()) {
      await kv.set(filename, data)
    } else {
      // Fallback to memory store for local development
      memoryStore[filename] = data
      console.warn(`KV not configured. Using in-memory storage for ${filename}. Data will not persist.`)
    }
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Initialize with default data if empty
export async function initializeData() {
  if (!isKvAvailable()) return
  
  try {
    // Initialize projects if empty
    const projects = await readDataFile('projects.json')
    if (projects.length === 0) {
      const defaultProjects = [
        {
          id: 1,
          title: "E-Commerce Platform",
          type: "Web App",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
          url: "https://example.com",
          tech: ["React", "Node.js", "MongoDB"],
          description: "Scalable e-commerce solution with real-time inventory management",
          fullDescription: "Built a comprehensive e-commerce platform with advanced features including real-time inventory tracking, secure payment processing, and seamless order management. The platform handles thousands of transactions daily with 99.9% uptime.",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Healthcare Management System",
          type: "Enterprise",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
          url: "https://example.com",
          tech: ["Next.js", "TypeScript", "PostgreSQL"],
          description: "HIPAA-compliant healthcare platform for patient management",
          fullDescription: "Developed a HIPAA-compliant healthcare management system that securely handles patient records, appointments, and medical billing. The system serves over 50 healthcare facilities with strict security and compliance requirements.",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      await writeDataFile('projects.json', defaultProjects)
    }

    // Initialize blogs if empty
    const blogs = await readDataFile('blogs.json')
    if (blogs.length === 0) {
      const defaultBlogs = [
        {
          id: 1,
          title: "10 Best Practices for Modern Web Development in 2024",
          excerpt: "Discover the latest trends and best practices that will shape web development this year.",
          content: "Full blog content goes here...",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
          date: new Date().toISOString().split('T')[0],
          readTime: "5 min read",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      await writeDataFile('blogs.json', defaultBlogs)
    }

    // Initialize promotions if empty
    const promotions = await readDataFile('promotions.json')
    if (promotions.length === 0) {
      const defaultPromotions = [
        {
          id: 1,
          text: "🎉 Special Offer: Get 20% off on all web development projects this month!",
          link: "/contact",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]
      await writeDataFile('promotions.json', defaultPromotions)
    }
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}
