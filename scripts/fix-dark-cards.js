const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const files = [
  'app/custom-software-development-usa/page.tsx',
  'app/website-maintenance-support-usa/page.tsx',
  'app/web-development-agency-usa/page.tsx',
  'app/hire-nextjs-developers-usa/page.tsx',
  'app/project-rescue/page.tsx',
]

for (const rel of files) {
  const file = path.join(root, rel)
  let s = fs.readFileSync(file, 'utf8')
  let n = s.replace(/backgroundColor:\s*'#0B2A6F'/g, "backgroundColor: '#FFFFFF'")
  n = n.replace(/borderColor:\s*'rgba\(255,255,255,0\.2\)'/g, "borderColor: '#E8ECF1'")
  if (rel.includes('custom-software')) {
    n = n.replace(/color:\s*'white'/g, "color: '#0C1222'")
    n = n.replace(/color:\s*'rgba\(255,255,255,0\.9\)'/g, "color: '#64748B'")
  }
  // Give light cards a border when they used to be filled dark panels
  n = n.replace(
    /backgroundColor: '#FFFFFF',\s*\n(\s*)color: '#0C1222',/g,
    "backgroundColor: '#FFFFFF',\n$1border: '1px solid #E8ECF1',\n$1boxShadow: 'none',\n$1color: '#0C1222',"
  )
  if (n !== s) {
    fs.writeFileSync(file, n)
    console.log('fixed', rel)
  } else {
    console.log('no change', rel)
  }
}
