/**
 * Sección "¿Quién es?" — Timeline interactivo + estadísticas animadas
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, CheckCircle } from 'lucide-react'
import AnimatedCounter from '../ui/AnimatedCounter'
import { timeline } from '../../data/timeline'

function TimelineItem({ item, index, isActive, onToggle }) {
  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Línea vertical y punto */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-impact text-sm transition-all shadow-md ${
            isActive
              ? 'bg-amarillo text-textoPrincipal shadow-yellow-200'
              : 'bg-white text-textoSecundario border-2 border-gray-200 hover:border-amarillo'
          }`}
          aria-label={`Ver ${item.titulo}`}
        >
          {isActive ? '✓' : index + 1}
        </motion.button>
        {index < timeline.length - 1 && (
          <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-gray-200 to-transparent min-h-[2rem]" />
        )}
      </div>

      {/* Contenido */}
      <div className="pb-8 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className="w-full text-left group"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-verde font-medium tracking-wider">
                {item.año}
              </span>
              <h3 className={`font-display font-semibold text-base sm:text-lg mt-0.5 transition-colors ${
                isActive ? 'text-textoPrincipal' : 'text-textoPrincipal/80 group-hover:text-textoPrincipal'
              }`}>
                {item.titulo}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: isActive ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 mt-1"
            >
              <ChevronRight size={18} className="text-textoSecundario" />
            </motion.div>
          </div>

          {/* Badge */}
          {item.badge && (
            <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-body font-semibold ${
              item.badge.includes('Colombia') ? 'bg-yellow-100 text-yellow-800' :
              item.badge.includes('Hito') ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {item.badge}
            </span>
          )}
        </button>

        {/* Descripción expandida */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm sm:text-base text-textoSecundario font-body leading-relaxed bg-fondo rounded-xl p-4 border border-gray-100">
                {item.descripcion}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const STATS = [
  { value: 1200000, suffix: '+', prefix: '', label: 'firmas ciudadanas verificadas', emoji: '✊' },
  { value: 0, suffix: '', prefix: '', label: 'condenas penales en 30 años de carrera', emoji: '⚖️' },
  { value: 30, suffix: '+', prefix: '', label: 'años sirviendo al país', emoji: '🏛️' },
  { value: 1, suffix: 'er', prefix: '', label: 'candidato afro independiente viable', emoji: '🇨🇴' },
]

export default function QuienEs() {
  const [activeIndex, setActiveIndex] = useState(null)

  function toggle(i) {
    setActiveIndex(prev => prev === i ? null : i)
  }

  return (
    <section id="quien-es" className="py-20 px-4 bg-fondo">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-verdeClaro text-verde text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Trayectoria
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-textoPrincipal mb-4">
            ¿Quién es Luis Gilberto Murillo?
          </h2>
          <p className="text-textoSecundario font-body text-base sm:text-lg max-w-2xl mx-auto">
            Del Chocó al mundo. Haz clic en cada hito para conocer su historia.
          </p>

          {/* Badge sin procesos */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-700 text-sm font-body font-semibold">
              ✔ Sin procesos judiciales
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display font-semibold text-lg text-textoPrincipal mb-6">
              Su historia
            </h3>
            <div>
              {timeline.map((item, i) => (
                <TimelineItem
                  key={item.año}
                  item={item}
                  index={i}
                  isActive={activeIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display font-semibold text-lg text-textoPrincipal mb-6">
              En números
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{stat.emoji}</span>
                    <div>
                      <div className="font-impact text-textoPrincipal"
                        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                          prefix={stat.prefix}
                          duration={2000}
                        />
                      </div>
                      <p className="text-textoSecundario text-xs font-body leading-snug mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-5 bg-white rounded-2xl border-l-4 border-amarillo shadow-sm"
            >
              <p className="font-display italic text-textoPrincipal text-base leading-relaxed">
                "No soy el candidato de ningún político. Soy el candidato de la gente."
              </p>
              <cite className="mt-2 block text-xs text-textoSecundario font-body not-italic">
                — Luis Gilberto Murillo, 2026
              </cite>
            </motion.blockquote>

            {/* Curiosidad */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-4 bg-amarilloClaro rounded-xl border border-yellow-200"
            >
              <p className="text-sm font-body text-textoPrincipal">
                <span className="font-semibold">🇨🇴 Dato clave:</span> Renunció a su ciudadanía
                estadounidense para poder ser embajador de Colombia en Washington. No fue un gesto
                simbólico — era un requisito legal. Y lo hizo.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
