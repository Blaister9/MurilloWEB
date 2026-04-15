/**
 * generate-og-image.js
 * Genera og-image.jpg (1200×630) para Open Graph / Twitter Card
 *
 * Requiere: npm install canvas (solo en dev — no va al bundle)
 *
 * Uso:
 *   node scripts/generate-og-image.js
 *
 * El archivo se guarda en public/og-image.jpg (Vite lo copia a /dist)
 */

const { createCanvas, registerFont } = require('canvas')
const path = require('path')
const fs = require('fs')

const OUT_PATH = path.join(__dirname, '..', 'public', 'og-image.jpg')
const WIDTH = 1200
const HEIGHT = 630

// ── Colores del design system LGM ──────────────────────────────────────────
const COLOR = {
  bg: '#1A3A0F',         // verde oscuro (hero gradient start)
  bgAccent: '#2D5A1B',   // verde medio
  amarillo: '#F5A623',
  white: '#FFFFFF',
  grayLight: 'rgba(255,255,255,0.65)',
}

function main() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  // ── Fondo degradado verde ────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  bg.addColorStop(0, COLOR.bg)
  bg.addColorStop(0.5, COLOR.bgAccent)
  bg.addColorStop(1, COLOR.bg)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // ── Decoración: círculo de fondo (blur visual) ───────────────────────────
  const grad = ctx.createRadialGradient(WIDTH * 0.75, HEIGHT * 0.5, 0, WIDTH * 0.75, HEIGHT * 0.5, 420)
  grad.addColorStop(0, 'rgba(245,166,35,0.12)')
  grad.addColorStop(1, 'rgba(245,166,35,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // ── Badge LGM (rectángulo amarillo superior izquierdo) ───────────────────
  const badgeX = 60
  const badgeY = 60
  const badgeW = 110
  const badgeH = 46
  const radius = 12
  ctx.beginPath()
  ctx.moveTo(badgeX + radius, badgeY)
  ctx.lineTo(badgeX + badgeW - radius, badgeY)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius)
  ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH)
  ctx.lineTo(badgeX + radius, badgeY + badgeH)
  ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius)
  ctx.lineTo(badgeX, badgeY + radius)
  ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY)
  ctx.closePath()
  ctx.fillStyle = COLOR.amarillo
  ctx.fill()

  ctx.fillStyle = COLOR.bg
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('LGM', badgeX + badgeW / 2, badgeY + badgeH / 2)

  // ── Tagline superior ─────────────────────────────────────────────────────
  ctx.textAlign = 'left'
  ctx.fillStyle = COLOR.amarillo
  ctx.font = '500 18px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText('INICIATIVA CIUDADANA · COLOMBIA 2026', 60, 180)

  // ── Nombre principal ─────────────────────────────────────────────────────
  ctx.fillStyle = COLOR.white
  ctx.font = 'bold 88px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText('LUIS GILBERTO', 60, 215)
  ctx.fillStyle = COLOR.amarillo
  ctx.fillText('MURILLO', 60, 315)

  // ── Separador horizontal ─────────────────────────────────────────────────
  ctx.fillStyle = COLOR.amarillo
  ctx.fillRect(60, 430, 80, 4)

  // ── Slogan ───────────────────────────────────────────────────────────────
  ctx.fillStyle = COLOR.grayLight
  ctx.font = '300 28px sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText('La Colombia olvidada merece un', 60, 455)
  ctx.fillText('presidente que la conoce por dentro.', 60, 493)

  // ── URL abajo derecha ────────────────────────────────────────────────────
  ctx.fillStyle = COLOR.amarillo
  ctx.font = '500 22px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('lgm2026.co', WIDTH - 60, HEIGHT - 50)

  // ── Línea decorativa vertical derecha ───────────────────────────────────
  ctx.strokeStyle = 'rgba(245,166,35,0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(WIDTH - 300, 60)
  ctx.lineTo(WIDTH - 300, HEIGHT - 60)
  ctx.stroke()

  // ── Guardar ──────────────────────────────────────────────────────────────
  const dir = path.dirname(OUT_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 })
  fs.writeFileSync(OUT_PATH, buffer)
  console.log(`✅ og-image.jpg generada en: ${OUT_PATH}`)
  console.log(`   Dimensiones: ${WIDTH}×${HEIGHT}px`)
}

main()
