const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'images')
const iconSvg = fs.readFileSync(path.join(dir, 'logo-arfa-developers-icon.svg'), 'utf8')
const iconInner = iconSvg.replace(/<svg[^>]*>/, '').replace('</svg>', '')

const full = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="120" viewBox="0 0 900 120">
  <g transform="translate(8,12) scale(2)">${iconInner}</g>
  <text x="120" y="78" font-family="Arial Black, Arial, sans-serif" font-size="52" font-weight="800">
    <tspan fill="#0A7CFF">ARFA</tspan><tspan fill="#111111">DEVELOPERS</tspan>
  </text>
</svg>`

async function main() {
  fs.writeFileSync(path.join(dir, 'logo-arfa-developers.svg'), full)

  await sharp(Buffer.from(iconSvg), { density: 400 })
    .resize(256, 256)
    .png()
    .toFile(path.join(dir, 'logo-arfa-developers-icon.png'))

  const buf = await sharp(Buffer.from(full), { density: 180 }).png().toBuffer()
  const trimmed = await sharp(buf).trim().png().toBuffer()
  await sharp(trimmed).toFile(path.join(dir, 'logo-arfa-developers.png'))

  const m = await sharp(trimmed).metadata()
  await sharp({
    create: {
      width: (m.width || 800) + 40,
      height: (m.height || 120) + 40,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite([{ input: trimmed, left: 20, top: 20 }])
    .png()
    .toFile(path.join(dir, '_logo-preview.png'))

  console.log('ok', m.width, m.height)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
