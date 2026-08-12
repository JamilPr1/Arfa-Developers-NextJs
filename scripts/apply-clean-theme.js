const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const skipDirs = new Set(['node_modules', '.next', 'admin', 'automation', 'arfa', 'scripts'])

const darkGrad =
  /linear-gradient\(135deg,\s*#0F274F\s*0%,\s*#1E40AF\s*48%,\s*#2563EB\s*100%\)/g
const lightGrad = 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)'

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (skipDirs.has(ent.name)) continue
      walk(p, out)
    } else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) {
      out.push(p)
    }
  }
  return out
}

const files = walk(root)
let changed = 0

for (const file of files) {
  // Skip voice widget internals
  if (file.includes(`${path.sep}arfa${path.sep}`) || file.includes('ArfaVoice')) continue

  let s = fs.readFileSync(file, 'utf8')
  const hadDark = darkGrad.test(s)
  darkGrad.lastIndex = 0
  if (
    !hadDark &&
    !s.includes('#F59E0B') &&
    !s.includes('#0F274F') &&
    !s.includes('#F5D76E') &&
    !s.includes('#FDE68A')
  ) {
    continue
  }

  let n = s
  n = n.replace(darkGrad, lightGrad)

  if (hadDark) {
    n = n.replace(/color:\s*'white'/g, "color: '#0C1222'")
    n = n.replace(/color:\s*"white"/g, 'color: "#0C1222"')
    n = n.replace(
      /color:\s*'rgba\(255,\s*255,\s*255,\s*0\.9\)'/g,
      "color: '#64748B'"
    )
    n = n.replace(
      /color:\s*"rgba\(255,\s*255,\s*255,\s*0\.9\)"/g,
      'color: "#64748B"'
    )
    n = n.replace(/#F5D76E/g, '#1D4ED8')
    n = n.replace(/#FDE68A/g, '#1D4ED8')
    n = n.replace(
      /radial-gradient\(circle at 20% 50%, rgba\(255,255,255,0\.1\) 0%, transparent 50%\)/g,
      'radial-gradient(circle at 100% 0%, rgba(29,78,216,0.06) 0%, transparent 50%)'
    )
  }

  n = n.replace(/#0F274F/g, '#0C1222')
  n = n.replace(/backgroundColor:\s*'#F59E0B'/g, "backgroundColor: '#0C1222'")
  n = n.replace(/background:\s*'#F59E0B'/g, "background: '#0C1222'")
  n = n.replace(/backgroundColor:\s*'#FBBF24'/g, "backgroundColor: '#1E293B'")
  n = n.replace(/background:\s*'#FBBF24'/g, "background: '#1E293B'")

  if (n !== s) {
    fs.writeFileSync(file, n)
    changed++
    console.log('updated', path.relative(root, file))
  }
}

console.log('files changed:', changed)
