import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/og-image.jpg')

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F5A623"/>
      <stop offset="100%" style="stop-color:#2D7A3E"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="rgba(0,0,0,0.38)"/>
  <text x="600" y="200" font-family="Arial Black, Arial" font-size="88"
    font-weight="bold" fill="white" text-anchor="middle">LUIS GILBERTO</text>
  <text x="600" y="305" font-family="Arial Black, Arial" font-size="88"
    font-weight="bold" fill="white" text-anchor="middle">MURILLO</text>
  <text x="600" y="400" font-family="Arial" font-size="34"
    fill="rgba(255,255,255,0.88)" text-anchor="middle">Del Choco - Sin partido - Sin escandalos</text>
  <text x="600" y="525" font-family="Arial" font-size="26"
    font-weight="bold" fill="#F5A623" text-anchor="middle">lgm2026.co - Colombia 2026 - 31 de mayo</text>
</svg>`

await sharp(Buffer.from(svg))
  .jpeg({ quality: 92 })
  .toFile(OUT)

console.log('og-image.jpg generado en public/')
