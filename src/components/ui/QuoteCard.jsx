/**
 * Tarjeta de cita para la sección TarjetasShare
 * Diseñada para ser descargada y compartida en redes sociales
 */
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, MessageCircle, Share2 } from 'lucide-react'
import { downloadImage, getWhatsAppUrl, openLink } from '../../utils/shareUtils'

export default function QuoteCard({ tarjeta, index }) {
  const cardRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    if (!cardRef.current) return
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetWidth, // cuadrado
      })
      downloadImage(canvas.toDataURL('image/png'), `lgm-tarjeta-${index + 1}.png`)
    } catch (err) {
      console.error('Error generando tarjeta:', err)
    } finally {
      setGenerating(false)
    }
  }

  const whatsappText = `${tarjeta.frase}\n\n#LGMurillo #Colombia2026 🇨🇴`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex flex-col gap-3"
    >
      {/* Tarjeta visual (la que se exporta) */}
      <div
        ref={cardRef}
        className="relative w-full aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center cursor-pointer"
        style={{
          background: tarjeta.background,
          minHeight: 0,
        }}
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-6xl">🇨🇴</div>
          <div className="absolute bottom-4 right-4 text-4xl">✊</div>
        </div>

        {/* Comilla decorativa */}
        <span
          className="font-impact text-7xl leading-none mb-2 opacity-30"
          style={{ color: tarjeta.textColor || '#FFFFFF' }}
        >
          "
        </span>

        {/* Frase principal */}
        <p
          className="font-display font-bold text-lg md:text-xl leading-snug relative z-10"
          style={{ color: tarjeta.textColor || '#FFFFFF' }}
        >
          {tarjeta.frase}
        </p>

        {/* Branding */}
        <div className="mt-6 flex items-center gap-2 relative z-10">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tarjeta.accentColor || 'rgba(255,255,255,0.6)' }}
          />
          <span
            className="font-impact tracking-widest text-sm"
            style={{ color: tarjeta.accentColor || 'rgba(255,255,255,0.8)' }}
          >
            LGM 2026
          </span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tarjeta.accentColor || 'rgba(255,255,255,0.6)' }}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-textoPrincipal text-white text-xs font-body font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Download size={13} />
          {generating ? 'Generando...' : 'Descargar'}
        </button>
        <button
          onClick={() => openLink(getWhatsAppUrl(whatsappText))}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500 text-white text-xs font-body font-semibold hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={13} />
          WhatsApp
        </button>
      </div>
    </motion.div>
  )
}
