const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const targets = []

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (['node_modules', '.next', 'admin', 'arfa', 'scripts'].includes(ent.name)) continue
      walk(p)
    } else if (/\.tsx$/.test(ent.name)) targets.push(p)
  }
}
walk(path.join(root, 'app'))
walk(path.join(root, 'components'))

let changed = 0
for (const file of targets) {
  if (file.includes(`${path.sep}admin${path.sep}`)) continue
  let s = fs.readFileSync(file, 'utf8')
  let n = s
  // Invisible white text on light heroes / cards
  n = n.replace(/color:\s*'rgba\(255,\s*255,\s*255,\s*0\.9[25]?\)'/g, "color: 'text.secondary'")
  n = n.replace(/color:\s*'rgba\(255,\s*255,\s*255,\s*0\.8\)'/g, "color: 'text.secondary'")
  n = n.replace(/color:\s*"rgba\(255,\s*255,\s*255,\s*0\.9[25]?\)"/g, 'color: "text.secondary"')
  // Amber leftovers on marketing heroes → primary blue
  n = n.replace(/#F59E0B/g, 'hsl(210, 98%, 48%)')
  if (n !== s) {
    fs.writeFileSync(file, n)
    changed++
    console.log('fixed', path.relative(root, file))
  }
}
console.log('files changed:', changed)
