/**
 * Comparador de candidatos — Tabla interactiva con filtros
 */
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import ComparadorRow from '../ui/ComparadorRow'
import { candidatos, criterios } from '../../data/candidatos'
import { downloadImage } from '../../utils/shareUtils'

export default function Comparador() {
  const [activeCandidatos, setActiveCandidatos] = useState(
    candidatos.map((c) => c.id) // todos activos por defecto
  )
  const [generating, setGenerating] = useState(false)
  const tableRef = useRef(null)

  // LGM siempre activo, no se puede quitar
  function toggleCandidato(id) {
    if (id === 'lgm') return
    setActiveCandidatos((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function exportarTabla() {
    if (!tableRef.current) return
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      downloadImage(canvas.toDataURL('image/png'), 'lgm-comparador-candidatos.png')
    } catch (err) {
      console.error('Error exportando:', err)
    } finally {
      setGenerating(false)
    }
  }

  const candidatosActivos = candidatos.filter((c) => activeCandidatos.includes(c.id))

  return (
    <section id="comparador" className="py-20 px-4 bg-fondo">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-amarilloClaro text-amarillo text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Análisis comparativo
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-textoPrincipal mb-4">
            Compara a los candidatos
          </h2>
          <p className="text-textoSecundario font-body text-base max-w-2xl mx-auto">
            Datos verificados con fuentes públicas. Hover/toca cada celda para ver el detalle.
          </p>
        </motion.div>

        {/* Filtros de candidatos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {candidatos.map((c) => {
            const isActive = activeCandidatos.includes(c.id)
            const isLGM = c.id === 'lgm'
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidato(c.id)}
                disabled={isLGM}
                className={`px-4 py-2 rounded-xl text-sm font-body font-semibold transition-all border-2 ${
                  isLGM ? 'cursor-default' : 'cursor-pointer'
                } ${
                  isActive
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-textoSecundario border-gray-200 opacity-50 hover:opacity-80'
                }`}
                style={isActive ? { backgroundColor: c.color, borderColor: c.color } : {}}
              >
                {c.nombre}
                {isLGM && (
                  <span className="ml-1.5 text-xs opacity-80 font-normal">(siempre visible)</span>
                )}
              </button>
            )
          })}
        </motion.div>

        {/* Tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100"
        >
          <div ref={tableRef} className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-textoPrincipal text-white">
                  <th className="p-4 text-left">
                    <span className="font-body text-sm font-semibold text-white/80">
                      Criterio
                    </span>
                  </th>
                  {candidatosActivos.map((c) => (
                    <th key={c.id} className="p-4 text-center min-w-[140px]">
                      <div
                        className={`font-body text-sm font-semibold px-2 py-1 rounded-lg ${
                          c.id === 'lgm' ? 'text-textoPrincipal bg-amarillo' : 'text-white'
                        }`}
                      >
                        {c.nombre}
                      </div>
                      <div className="text-xs text-white/50 mt-0.5 font-body">
                        {c.partido}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criterios.map((criterio) => (
                  <ComparadorRow
                    key={criterio.id}
                    criterio={criterio}
                    candidatosActivos={candidatosActivos.map((c) => c.id)}
                    fuente={criterio.fuente}
                  />
                ))}
              </tbody>
            </table>

            {/* Footer de la tabla */}
            <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-body text-textoSecundario">
                <span className="flex items-center gap-1">✅ Sin problemas</span>
                <span className="flex items-center gap-1">⚠️ Contexto relevante</span>
                <span className="flex items-center gap-1">❌ Documentado</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Datos verificados · Abril 2026
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botón exportar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            onClick={exportarTabla}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-textoPrincipal hover:bg-gray-800 text-white text-sm font-body font-semibold transition-colors disabled:opacity-50 shadow-md"
          >
            <Download size={16} />
            {generating ? 'Generando imagen...' : '📊 Descargar comparación como imagen'}
          </button>
          <p className="text-xs text-textoSecundario font-body">
            Perfecta para compartir en redes sociales
          </p>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-gray-400 font-body max-w-2xl mx-auto">
          Todos los datos provienen de fuentes públicas verificables: Fiscalía General, Corte
          Suprema, Registraduría Nacional, El Tiempo, El Espectador y declaraciones públicas de los
          candidatos. Hover en cada celda para ver la fuente.
        </p>
      </div>
    </section>
  )
}
