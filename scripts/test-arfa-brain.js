/**
 * Local smoke test for Arfa pages knowledge + brain memory.
 * Run: node scripts/test-arfa-brain.js
 */
const path = require('path')

async function main() {
  // Register ts via next's compiled paths is hard; test JSON + require compiled logic inline
  const brainPath = path.join(__dirname, '..', 'lib', 'data', 'arfa-brain.json')
  const fs = require('fs')
  const brain = JSON.parse(fs.readFileSync(brainPath, 'utf8'))
  console.log(`Brain seed memories: ${brain.length}`)
  brain.forEach((m, i) => console.log(`  ${i + 1}. [${m.hitCount}x] ${m.question}`))

  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'lib', 'data', 'products.json'), 'utf8')
  )
  console.log(`\nProducts in catalog: ${products.filter((p) => p.published).length}`)

  // Dynamic import of TS modules via next isn't available here — call HTTP if server up
  const base = process.env.TEST_BASE_URL || 'http://localhost:3002'
  try {
    const statusRes = await fetch(`${base}/api/voice/brain`)
    if (statusRes.ok) {
      const status = await statusRes.json()
      console.log('\nLive /api/voice/brain:')
      console.log(JSON.stringify(status, null, 2))
    } else {
      console.log(`\nServer status ${statusRes.status} at ${base} — start next dev to test live API`)
    }

    const processRes = await fetch(`${base}/api/voice/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: 'Can you rescue a failed project?' }),
    })
    if (processRes.ok) {
      const result = await processRes.json()
      console.log('\nProcess test (project rescue):')
      console.log(`  model/meta: ${JSON.stringify(result.meta)}`)
      console.log(`  intent: ${result.intent}`)
      console.log(`  text: ${result.text}`)
      console.log(`  action: ${JSON.stringify(result.action)}`)
    } else {
      console.log(`\nProcess API ${processRes.status}`)
    }

    // Second ask — should hit brain / similar memory
    const processRes2 = await fetch(`${base}/api/voice/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: 'Do you rescue abandoned freelancer projects?' }),
    })
    if (processRes2.ok) {
      const result2 = await processRes2.json()
      console.log('\nProcess test (similar brain question):')
      console.log(`  intent: ${result2.intent}`)
      console.log(`  text: ${result2.text}`)
    }
  } catch (e) {
    console.log(`\nCould not reach ${base}: ${e.message}`)
    console.log('Start the site with: npm run dev -- -p 3002')
  }
}

main()
