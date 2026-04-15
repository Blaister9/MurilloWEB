/**
 * Tarjeta de propuesta con descripción expandible, fuentes verificadas y sharing
 */
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Share2, Download, MessageCircle, ExternalLink, BookOpen } from 'lucide-react'
import { getWhatsAppUrl, getTwitterUrl, openLink, downloadImage, SHARE_URL } from '../../utils/shareUtils'

export default function PropuestaCard({ propuesta, index }) {
  const [expanded, setExpanded] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const cardRef = useRef(null)

  async function handleShare() {
    setSharing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      downloadImage(canvas.toDataURL('image/png'), `lgm-propuesta-${propuesta.id}.png`)
    } catch (err) {
      console.error('Error generando imagen:', err)
    } finally {
      setSharing(false)
      setShowShareMenu(false)
    }
  }

  const shareText = `📌 Propuesta de LGM: ${propuesta.titulo}\n\n${propuesta.descripcionCorta}\n\nFuente verificada: ${propuesta.fuentes?.[0]?.label || ''}\n\n#LGMurillo #Colombia2026`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: `0 20px 40px ${propuesta.color}25` }}
      className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Número decorativo */}
      <span
        className="absolute top-4 right-4 font-impact text-6xl opacity-[0.06] select-none pointer-events-none"
        style={{ color: propuesta.color }}
      >
        {String(propuesta.id).padStart(2, '0')}
      </span>

      {/* Contenido exportable */}
      <div ref={cardRef} className="bg-white p-1 flex-1">
        {/* Tag */}
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-semibold mb-3"
          style={{ backgroundColor: `${propuesta.color}15`, color: propuesta.color }}
        >
          {propuesta.tag}
        </span>

        {/* Ícono y título */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl flex-shrink-0 mt-0.5">{propuesta.icono}</span>
          <h3 className="font-display font-bold text-lg text-textoPrincipal leading-tight">
            {propuesta.titulo}
          </h3>
        </div>

        {/* Descripción */}
        <AnimatePresence initial={false}>
          <p className="text-textoSecundario text-sm font-body leading-relaxed">
            {expanded ? propuesta.descripcionLarga : propuesta.descripcionCorta}
          </p>
        </AnimatePresence>
      </div>

      {/* Fuentes verificadas */}
      {propuesta.fuentes && propuesta.fuentes.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-1.5 text-xs font-body font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BookOpen size={12} />
            📰 {propuesta.fuentes.length} {propuesta.fuentes.length === 1 ? 'fuente verificada' : 'fuentes verificadas'}
            <motion.span
              animate={{ rotate: showSources ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={11} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-2 pt-2 border-t border-gray-100">
                  {propuesta.fuentes.map((f, i) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1.5 text-xs text-azulCTA hover:text-blue-700 hover:underline mb-1.5 group"
                    >
                      <ExternalLink size={10} className="mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                      <span className="line-clamp-2">{f.label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Acciones */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-body font-medium text-textoSecundario hover:text-textoPrincipal transition-colors"
        >
          {expanded ? 'Ver menos' : 'Leer más'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all"
            style={{ backgroundColor: `${propuesta.color}15`, color: propuesta.color }}
          >
            <Share2 size={13} />
            📤 Compartir
          </button>

          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 min-w-[185px]"
            >
              <button
                onClick={() => { openLink(getWhatsAppUrl(shareText, SHARE_URL)); setShowShareMenu(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-green-50 text-green-600 font-body font-medium transition-colors"
              >
                <MessageCircle size={15} />
                WhatsApp
              </button>
              <button
                onClick={() => { openLink(getTwitterUrl(shareText, SHARE_URL)); setShowShareMenu(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 text-gray-800 font-body font-medium transition-colors"
              >
                <span className="text-base font-bold">𝕏</span>
                X (Twitter)
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-yellow-50 text-amarillo font-body font-medium transition-colors disabled:opacity-50"
              >
                <Download size={15} />
                {sharing ? 'Generando...' : 'Descargar imagen'}
              </button>
              <button
                onClick={() => setShowShareMenu(false)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 text-gray-400 font-body transition-colors"
              >
                ✕ Cerrar
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
