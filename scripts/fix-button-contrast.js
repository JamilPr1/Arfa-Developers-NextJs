const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const skip = new Set(['node_modules', '.next', 'admin', 'scripts'])

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (skip.has(ent.name)) continue
      walk(p, out)
    } else if (/\.tsx$/.test(ent.name)) out.push(p)
  }
  return out
}

let changed = 0
for (const file of walk(root)) {
  let s = fs.readFileSync(file, 'utf8')
  // Contained ink buttons must use white label text
  let n = s.replace(
    /(backgroundColor:\s*'#0C1222',\s*\n\s*)color:\s*'#0C1222'/g,
    "$1color: '#FFFFFF'"
  )
  n = n.replace(
    /(background:\s*'#0C1222',\s*\n\s*)color:\s*'#0C1222'/g,
    "$1color: '#FFFFFF'"
  )
  if (n !== s) {
    fs.writeFileSync(file, n)
    changed++
    console.log('fixed buttons', path.relative(root, file))
  }
}
console.log('files changed:', changed)
