/**
 * Compress product PNGs to WebP for faster page loads.
 * Run: node scripts/compress-product-images.js
 */
const fs = require('fs')
const path = require('path')

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Install sharp first: npm install sharp --save-dev')
    process.exit(1)
  }

  const dir = path.join(process.cwd(), 'public', 'images', 'products')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'))

  let saved = 0
  for (const file of files) {
    const input = path.join(dir, file)
    const output = path.join(dir, file.replace(/\.png$/i, '.webp'))
    const before = fs.statSync(input).size

    await sharp(input)
      .resize(1600, 900, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(output)

    const after = fs.statSync(output).size
    saved += before - after
    console.log(`${file} → ${path.basename(output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`)
  }

  console.log(`\nTotal saved: ${Math.round(saved / 1024)}KB across ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
