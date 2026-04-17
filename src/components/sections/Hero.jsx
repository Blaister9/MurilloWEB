/**
 * Sección Hero — Impacto inmediato
 * Gradiente animado, nombre enorme, typewriter, botón de sharing
 */
import { useState, useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, ChevronDown } from 'lucide-react'
import { useShare } from '../../hooks/useShare'

const FRASES = [
  'El candidato de la Colombia olvidada.',
  'Sin partido. Sin jefe. Con 1.2 millones de firmas.',
  'Del Chocó a la Casa de Nariño.',
  'Independiente. Limpio. Preparado.',
]

// Partículas decorativas
function Particle({ x, y, delay, size, color }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, backgroundColor: color }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: i * 0.3,
  size: 8 + Math.random() * 20,
  color: i % 3 === 0 ? '#F5A623' : i % 3 === 1 ? '#2D7A3E' : '#FFFFFF',
}))

// Contador regresivo compacto para el Hero
function HeroCountdown() {
  const { dias, horas, minutos, segundos } = useCountdown()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2"
    >
      <span className="text-white/80 text-xs font-body mr-1">🗓️ 31 mayo ·</span>
      {[
        { val: dias, label: 'd' },
        { val: horas, label: 'h' },
        { val: minutos, label: 'm' },
        { val: segundos, label: 's' },
      ].map(({ val, label }, i) => (
        <span key={label} className="flex items-baseline gap-0.5">
          <span className="font-impact text-amarillo text-xl">
            {String(val).padStart(2, '0')}
          </span>
          <span className="text-white/60 text-xs font-body">{label}</span>
          {i < 3 && <span className="text-white/40 mx-0.5 font-impact">:</span>}
        </span>
      ))}
    </motion.div>
  )
}

// Efecto typewriter
function Typewriter({ phrases }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[phraseIndex]
    let timeout

    if (!isDeleting && displayed === phrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2500)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    } else {
      const delta = isDeleting ? 40 : 60
      timeout = setTimeout(() => {
        setDisplayed(
          isDeleting ? phrase.slice(0, displayed.length - 1) : phrase.slice(0, displayed.length + 1)
        )
      }, delta)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex, phrases])

  return (
    <span>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function Hero() {
  const { share } = useShare()

  function scrollToPropuestas() {
    document.querySelector('#propuestas')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A3A0F] via-[#2D5A1B] to-[#1A1A0F]">
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 pointer-events-none" />

      {/* Partículas — omitir si el usuario prefiere menos movimiento */}
      {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Patrón de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20 pb-16">

        {/* Badge flotante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <HeroCountdown />
        </motion.div>

        {/* Nombre principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h1 className="font-impact leading-none text-white mb-2"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '0.04em' }}>
            LUIS GILBERTO
          </h1>
          <h1
            className="font-impact leading-none"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              letterSpacing: '0.04em',
              color: '#F5A623',
              textShadow: '0 0 60px rgba(245,166,35,0.4)',
            }}
          >
            MURILLO
          </h1>
        </motion.div>

        {/* Subtítulo typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 mb-8 h-10 flex items-center justify-center"
        >
          <p className="font-display text-lg sm:text-xl md:text-2xl text-white/90 italic max-w-2xl">
            <Typewriter phrases={FRASES} />
          </p>
        </motion.div>

        {/* Tags de credenciales */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {[
            '🇨🇴 Del Chocó',
            '🎓 Geólogo Doctor',
            '🏛️ Ex-Canciller',
            '🤝 Sin partido',
            '🌿 Ministro Ambiente',
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-body font-medium"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => share({
              title: 'Luis Gilberto Murillo — Candidato Presidencial 2026',
              text: 'Sin partido. Sin jefe. Sin escándalos. Del Chocó a la Casa de Nariño. 🇨🇴 #LGMurillo #Colombia2026',
            })}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-azulCTA hover:bg-blue-600 text-white font-body font-bold text-base shadow-2xl shadow-blue-900/40 transition-all"
          >
            <Share2 size={20} />
            📲 Comparte esta página
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToPropuestas}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 hover:border-white/60 text-white font-body font-semibold text-base backdrop-blur-sm transition-all"
          >
            Ver propuestas
            <ChevronDown size={18} />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-white/40"
          >
            <span className="text-xs font-body">Descubre más</span>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
