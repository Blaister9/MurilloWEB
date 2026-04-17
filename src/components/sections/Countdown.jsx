/**
 * Barra de contador regresivo entre Hero y QuienEs
 * Fondo amarillo, fuente Bebas Neue, tiempo real
 */
import { useCountdown } from '../../hooks/useCountdown'
import { motion } from 'framer-motion'

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-impact text-textoPrincipal"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-body text-xs font-medium text-textoPrincipal/60 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const { dias, horas, minutos, segundos } = useCountdown()
  const time = { days: dias, hours: horas, minutes: minutos, seconds: segundos }

  return (
    <div className="bg-amarillo py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          {/* Texto */}
          <div className="text-center sm:text-left">
            <p className="font-impact text-textoPrincipal tracking-widest"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>
              FALTAN
            </p>
            <p className="font-body text-xs text-textoPrincipal/60 font-medium">
              para que Colombia decida · 31 de mayo 2026
            </p>
          </div>

          {/* Separador */}
          <div className="hidden sm:block w-px h-12 bg-textoPrincipal/20" />

          {/* Contador */}
          <div className="flex items-end gap-4 sm:gap-6">
            <TimeUnit value={time.days} label="días" />
            <span className="font-impact text-textoPrincipal/40 pb-5" style={{ fontSize: '2rem' }}>:</span>
            <TimeUnit value={time.hours} label="horas" />
            <span className="font-impact text-textoPrincipal/40 pb-5" style={{ fontSize: '2rem' }}>:</span>
            <TimeUnit value={time.minutes} label="minutos" />
            <span className="font-impact text-textoPrincipal/40 pb-5" style={{ fontSize: '2rem' }}>:</span>
            <TimeUnit value={time.seconds} label="segundos" />
          </div>

          {/* Separador */}
          <div className="hidden sm:block w-px h-12 bg-textoPrincipal/20" />

          {/* Badge */}
          <div className="text-center sm:text-left">
            <p className="font-impact text-textoPrincipal tracking-wider"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              PRIMERA VUELTA
            </p>
            <p className="font-body text-xs text-textoPrincipal/60 font-medium">
              #LGMurillo #Colombia2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
