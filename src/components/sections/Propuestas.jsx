/**
 * Sección de propuestas — Grid de 6 tarjetas compartibles
 */
import { motion } from 'framer-motion'
import PropuestaCard from '../ui/PropuestaCard'
import { propuestas } from '../../data/propuestas'

export default function Propuestas() {
  return (
    <section id="propuestas" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-amarilloClaro text-amarillo text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Programa de gobierno
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-textoPrincipal mb-4">
            6 propuestas concretas
          </h2>
          <p className="text-textoSecundario font-body text-base sm:text-lg max-w-2xl mx-auto">
            No promesas vagas. Propuestas claras de alguien que conoce el Estado desde adentro.
            <br />
            <span className="text-azulCTA font-medium">Comparte la que más te resuene. 📤</span>
          </p>
        </motion.div>

        {/* Grid de propuestas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {propuestas.map((propuesta, index) => (
            <PropuestaCard
              key={propuesta.id}
              propuesta={propuesta}
              index={index}
            />
          ))}
        </div>

        {/* Banner de sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-azulCTA to-blue-700 rounded-2xl text-white text-center"
        >
          <p className="font-display font-semibold text-xl mb-2">
            ¿Te convencen estas propuestas?
          </p>
          <p className="font-body text-white/80 text-sm mb-4">
            Cada tarjeta tiene un botón para compartir en WhatsApp, X o descargar como imagen.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-body">
              📲 WhatsApp
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-body">
              𝕏 Twitter/X
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-body">
              📸 Instagram Stories
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
