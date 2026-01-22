#!/usr/bin/env node

/**
 * Cache Revalidation Script
 * 
 * This script clears the Next.js cache on the production site.
 * Run this after deploying to ensure changes reflect immediately.
 * 
 * Usage:
 *   node scripts/revalidate-cache.js
 *   node scripts/revalidate-cache.js --path=/about
 *   node scripts/revalidate-cache.js --tag=all
 */

const https = require('https')
const http = require('http')

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://www.arfadevelopers.com'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''

// Parse command line arguments
const args = process.argv.slice(2)
const pathArg = args.find(arg => arg.startsWith('--path='))?.split('=')[1] || '/'
const tagArg = args.find(arg => arg.startsWith('--tag='))?.split('=')[1]

const url = new URL(`${PRODUCTION_URL}/api/revalidate`)
if (REVALIDATE_SECRET) {
  url.searchParams.set('secret', REVALIDATE_SECRET)
}
if (tagArg) {
  url.searchParams.set('tag', tagArg)
} else {
  url.searchParams.set('path', pathArg)
}

console.log(`🔄 Revalidating cache for: ${PRODUCTION_URL}`)
console.log(`📍 Path: ${tagArg ? `tag=${tagArg}` : pathArg}`)
console.log(`🌐 Calling: ${url.toString().replace(REVALIDATE_SECRET, '***')}`)

const client = url.protocol === 'https:' ? https : http

const req = client.request(url, { method: 'GET' }, (res) => {
  let data = ''
  
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data)
      if (result.revalidated) {
        console.log('✅ Cache revalidated successfully!')
        console.log(`   Timestamp: ${result.timestamp}`)
        if (result.message) {
          console.log(`   ${result.message}`)
        }
      } else {
        console.error('❌ Revalidation failed:', result.error || 'Unknown error')
        process.exit(1)
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error)
      console.log('Response:', data)
      process.exit(1)
    }
  })
})

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message)
  process.exit(1)
})

req.end()
