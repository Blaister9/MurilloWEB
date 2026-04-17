import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/og-image.jpg')

// Si ya existe la imagen, no regenerar (p.ej. en Netlify sin canvas)
if (existsSync(OUT)) {
  console.log('og-image.jpg ya existe, omitiendo regeneracion.')
  process.exit(0)
}

let createCanvas
try {
  const mod = await import('canvas')
  createCanvas = mod.createCanvas
} catch {
  console.warn('Advertencia: modulo canvas no disponible. Omitiendo generacion de og-image.jpg.')
  console.warn('Ejecuta: npm install canvas  (requiere libcairo2-dev en Linux)')
  process.exit(0)
}

const W = 1200, H = 630
const canvas = createCanvas(W, H)
const ctx = canvas.getContext('2d')

// Fondo gradiente amarillo -> verde
const grad = ctx.createLinearGradient(0, 0, W, H)
grad.addColorStop(0, '#F5A623')
grad.addColorStop(1, '#2D7A3E')
ctx.fillStyle = grad
ctx.fillRect(0, 0, W, H)

// Overlay oscuro
ctx.fillStyle = 'rgba(0,0,0,0.38)'
ctx.fillRect(0, 0, W, H)

// Titulo
ctx.fillStyle = '#FFFFFF'
ctx.font = 'bold 88px Arial'
ctx.textAlign = 'center'
ctx.fillText('LUIS GILBERTO', W / 2, 210)
ctx.fillText('MURILLO', W / 2, 308)

// Subtitulo
ctx.font = '34px Arial'
ctx.fillStyle = 'rgba(255,255,255,0.88)'
ctx.fillText('Del Choco - Sin partido - Sin escandalos', W / 2, 408)

// Badge URL
ctx.font = 'bold 26px Arial'
ctx.fillStyle = '#F5A623'
ctx.fillText('lgm2026.co - Colombia 2026 - 31 de mayo', W / 2, 525)

// Guardar
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, canvas.toBuffer('image/jpeg', { quality: 0.92 }))
console.log('og-image.jpg generado en public/')
