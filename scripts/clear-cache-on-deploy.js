#!/usr/bin/env node

/**
 * Automatic Cache Clearing Script
 * 
 * This script runs automatically after every deployment to clear all caches.
 * It's called by Vercel's build command to ensure changes reflect immediately.
 * 
 * Usage:
 *   node scripts/clear-cache-on-deploy.js
 */

const https = require('https')
const http = require('http')

// Get production URL from environment or use default
const PRODUCTION_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.PRODUCTION_URL || 'https://www.arfadevelopers.com'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''

// Paths to revalidate
const pathsToRevalidate = [
  '/',
  '/admin',
  '/services',
  '/portfolio',
  '/blog',
  '/about',
  '/contact',
]

async function revalidatePath(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${PRODUCTION_URL}/api/revalidate`)
    if (REVALIDATE_SECRET) {
      url.searchParams.set('secret', REVALIDATE_SECRET)
    }
    url.searchParams.set('path', path)

    const client = url.protocol === 'https:' ? https : http

    const req = client.request(url.toString(), { method: 'GET' }, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Revalidated: ${path}`)
          resolve(JSON.parse(data))
        } else {
          console.error(`❌ Failed to revalidate ${path}: ${res.statusCode}`)
          console.error(`Response: ${data}`)
          reject(new Error(`Failed with status ${res.statusCode}`))
        }
      })
    })

    req.on('error', (error) => {
      console.error(`❌ Error revalidating ${path}:`, error.message)
      reject(error)
    })

    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

async function clearAllCaches() {
  console.log('🔄 Starting automatic cache clearing...')
  console.log(`🌐 Production URL: ${PRODUCTION_URL}`)
  
  try {
    // Revalidate all important paths
    for (const path of pathsToRevalidate) {
      try {
        await revalidatePath(path)
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.warn(`⚠️  Warning: Could not revalidate ${path}:`, error.message)
      }
    }

    // Also revalidate by tag 'all' if supported
    try {
      const url = new URL(`${PRODUCTION_URL}/api/revalidate`)
      if (REVALIDATE_SECRET) {
        url.searchParams.set('secret', REVALIDATE_SECRET)
      }
      url.searchParams.set('tag', 'all')

      const client = url.protocol === 'https:' ? https : http
      const req = client.request(url.toString(), { method: 'GET' }, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Revalidated all content by tag')
          }
        })
      })
      req.on('error', () => {}) // Ignore errors for tag revalidation
      req.end()
    } catch (error) {
      // Ignore tag revalidation errors
    }

    console.log('✅ Cache clearing completed!')
    console.log('📝 Changes should now be visible on the live site.')
  } catch (error) {
    console.error('❌ Error during cache clearing:', error.message)
    // Don't fail the build if cache clearing fails
    process.exit(0)
  }
}

// Only run if we're in a deployment environment
if (process.env.VERCEL || process.env.CI || process.argv.includes('--force')) {
  clearAllCaches().catch(() => {
    // Don't fail the build
    process.exit(0)
  })
} else {
  console.log('ℹ️  Skipping cache clear (not in deployment environment)')
  console.log('   Run with --force to clear cache anyway')
  process.exit(0)
}
