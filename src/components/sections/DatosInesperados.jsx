/**
 * DatosInesperados — Datos sorprendentes sobre LGM en formato flip-card
 * Un dato a la vez, botón siguiente, share por WhatsApp
 * Ubicado entre Comparador y TarjetasShare
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, RefreshCw, Share2, ExternalLink } from 'lucide-react'
import { datosInesperados } from '../../data/datosInesperados'
import { getWhatsAppUrl, openLink } from '../../utils/shareUtils'
import { registrarShare } from '../../utils/difusionTracker'

// ─── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ dato, flipped, onFlip }) {
  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1000px', aspectRatio: '4/3' }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
      >
        {/* Frente */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-textoPrincipal to-gray-800 flex flex-col items-center justify-center p-8 text-center shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, repeatType: 'loop' }}
            className="text-6xl mb-5"
          >
            {dato.emoji}
          </motion.div>
          <p className="font-display font-bold text-white text-lg sm:text-xl leading-snug mb-4">
            {dato.frente}
          </p>
          <p className="font-body text-xs text-amarillo uppercase tracking-widest opacity-70">
            Toca para descubrir →
          </p>
        </div>

        {/* Dorso */}
        <div
          className="absolute inset-0 rounded-3xl bg-white flex flex-col justify-between p-7 shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{dato.emoji}</span>
              <span className="font-display font-bold text-textoPrincipal text-base">
                {dato.tituloCarta}
              </span>
            </div>
            <p className="font-body text-textoSecundario text-sm leading-relaxed">
              {dato.dorso}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a
              href={dato.fuenteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-body text-azulCTA hover:underline"
            >
              <ExternalLink size={11} />
              {dato.fuente}
            </a>
            <p className="text-xs font-body text-gray-400">
              Toca para voltear
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Sección principal ────────────────────────────────────────────────────────
export default function DatosInesperados() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState(1)

  const dato = datosInesperados[currentIdx]
  const total = datosInesperados.length

  function siguiente() {
    setDirection(1)
    setFlipped(false)
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % total)
    }, 80)
  }

  function anterior() {
    setDirection(-1)
    setFlipped(false)
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + total) % total)
    }, 80)
  }

  function aleatorio() {
    setFlipped(false)
    setTimeout(() => {
      let next
      do {
        next = Math.floor(Math.random() * total)
      } while (next === currentIdx)
      setCurrentIdx(next)
    }, 80)
  }

  function handleShare() {
    openLink(getWhatsAppUrl(dato.waText))
    registrarShare('dato_inesperado')
  }

  return (
    <section id="datos-inesperados" className="py-20 px-4 bg-fondo">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            ¿Lo sabías?
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-textoPrincipal mb-3">
            Datos inesperados
          </h2>
          <p className="text-textoSecundario font-body text-sm max-w-xs mx-auto">
            Lo que probablemente no sabías sobre Luis Gilberto Murillo.
            Toca la tarjeta para descubrir el contexto.
          </p>
        </motion.div>

        {/* Contador */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="font-mono text-xs text-textoSecundario">
            {currentIdx + 1} / {total}
          </p>
          <button
            onClick={aleatorio}
            className="flex items-center gap-1 text-xs font-body text-textoSecundario hover:text-textoPrincipal transition-colors"
          >
            <RefreshCw size={12} />
            Dato al azar
          </button>
        </div>

        {/* Flip Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.22 }}
          >
            <FlipCard dato={dato} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={anterior}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-textoPrincipal text-xs font-body font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            ← Anterior
          </button>
          <button
            onClick={siguiente}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-textoPrincipal text-white text-xs font-body font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Siguiente
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {datosInesperados.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIdx ? 1 : -1)
                setFlipped(false)
                setTimeout(() => setCurrentIdx(i), 80)
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIdx ? 'bg-amarillo w-5 h-2' : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
              }`}
              aria-label={`Dato ${i + 1}`}
            />
          ))}
        </div>

        {/* Compartir por WhatsApp */}
        <div className="mt-6 text-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-body font-semibold transition-colors shadow-md"
          >
            <Share2 size={15} />
            Compartir este dato por WhatsApp
          </button>
          <p className="text-xs text-gray-400 font-body mt-2">
            Compártelo para que más personas lo conozcan
          </p>
        </div>
      </div>
    </section>
  )
}
