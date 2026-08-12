const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'app', 'admin', 'page.tsx')
let s = fs.readFileSync(file, 'utf8')

// Login shell → light marketing backdrop
s = s.replace(
  /bgcolor: '#1E3A8A', background: 'linear-gradient\(135deg, #1E3A8A 0%, #2563EB 100%\)'/g,
  "bgcolor: 'background.default', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210,100%,92%), transparent)'"
)

// Brand blues → official marketing palette
s = s.split('#1E3A8A').join('hsl(210, 100%, 35%)')
s = s.split('#2563EB').join('hsl(210, 98%, 48%)')

// App bar: charcoal like marketing primary buttons
s = s.replace(
  /<AppBar position="fixed" sx=\{\{ bgcolor: 'hsl\(210, 100%, 35%\)'/g,
  `<AppBar position="fixed" sx={{ bgcolor: 'hsl(220, 30%, 6%)'`
)

// Dialog titles that used navy
s = s.replace(
  /DialogTitle sx=\{\{ bgcolor: 'hsl\(210, 100%, 35%\)'/g,
  `DialogTitle sx={{ bgcolor: 'hsl(220, 30%, 6%)'`
)

fs.writeFileSync(file, s)
console.log('admin page theme colors updated')

const reset = path.join(__dirname, '..', 'app', 'admin', 'reset', 'page.tsx')
if (fs.existsSync(reset)) {
  let r = fs.readFileSync(reset, 'utf8')
  r = r.split('#1E3A8A').join('hsl(210, 100%, 35%)')
  r = r.split('#2563EB').join('hsl(210, 98%, 48%)')
  fs.writeFileSync(reset, r)
  console.log('admin reset updated')
}
