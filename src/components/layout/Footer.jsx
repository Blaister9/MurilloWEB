/**
 * Footer con links a redes, disclaimer, nota de transparencia y botón flotante de WhatsApp
 */
import { motion } from 'framer-motion'
import { Twitter, Instagram, MessageCircle, ExternalLink, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getWhatsAppUrl, openLink, SHARE_URL } from '../../utils/shareUtils'

const REDES = [
  {
    nombre: 'X (Twitter)',
    handle: '@LuisGMurillo',
    url: 'https://twitter.com/LuisGMurillo',
    icon: Twitter,
    color: '#000000',
  },
  {
    nombre: 'Instagram',
    handle: '@lgmurillo',
    url: 'https://instagram.com/lgmurillo',
    icon: Instagram,
    color: '#E1306C',
  },
]

export default function Footer() {
  const navigate = useNavigate()
  const waText = 'Acabo de ver esta web sobre LGM Murillo 👀 ¿Ya la viste? #LGMurillo #Colombia2026'

  return (
    <>
      {/* Footer principal */}
      <footer className="bg-textoPrincipal text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo y misión */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amarillo flex items-center justify-center font-impact text-textoPrincipal text-base">
                  LGM
                </div>
                <span className="font-impact text-2xl tracking-widest text-amarillo">
                  MURILLO 2026
                </span>
              </div>
              <p className="text-gray-400 text-sm font-body leading-relaxed">
                La Colombia olvidada merece un presidente que la conoce por dentro.
              </p>
              <p className="mt-3 text-xs text-gray-500 font-body">
                31 de mayo de 2026 · Primera vuelta
              </p>
            </div>

            {/* Redes sociales */}
            <div>
              <h4 className="font-display font-semibold text-base mb-4 text-white">
                Redes del candidato
              </h4>
              <div className="flex flex-col gap-3">
                {REDES.map((red) => {
                  const Icon = red.icon
                  return (
                    <a
                      key={red.nombre}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group"
                    >
                      <Icon size={16} />
                      <span className="text-sm font-body">{red.handle}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Compartir */}
            <div>
              <h4 className="font-display font-semibold text-base mb-4 text-white">
                Comparte esta web
              </h4>
              <p className="text-gray-400 text-sm font-body mb-4">
                Cada share suma. Difunde las ideas de LGM en tus redes.
              </p>
              <button
                onClick={() => openLink(getWhatsAppUrl(waText, SHARE_URL))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-body font-semibold transition-colors mb-2"
              >
                <MessageCircle size={16} />
                Compartir por WhatsApp
              </button>
              <button
                onClick={() => navigate('/qr')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-body font-semibold transition-colors border border-white/20"
              >
                <QrCode size={16} />
                Ver código QR para imprimir
              </button>
            </div>
          </div>

          {/* Nota de transparencia */}
          <div className="border-t border-gray-700 pt-6 mb-5">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-yellow-400 text-xs font-mono font-semibold mb-2 uppercase tracking-wider">
                ⚠️ Nota de transparencia
              </p>
              <p className="text-gray-400 text-xs font-body leading-relaxed">
                Las propuestas aquí presentadas provienen de declaraciones públicas verificadas de
                Luis Gilberto Murillo en medios de comunicación entre octubre 2025 y abril 2026.{' '}
                <strong className="text-gray-300">
                  No existe aún un documento oficial de Programa de Gobierno publicado por la campaña.
                </strong>{' '}
                Los datos del comparador de candidatos son de registros públicos verificables. Cada
                propuesta incluye enlace directo a la fuente original.
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700 pt-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500 font-body">
              <p>
                Iniciativa ciudadana independiente — no es la web oficial de la campaña. Datos verificados a abril 2026.
              </p>
              <p>
                #LGMurillo · #Colombia2026 · #LaColombiaOlvidada
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        onClick={() => openLink(getWhatsAppUrl(waText, SHARE_URL))}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        aria-label="Compartir por WhatsApp"
        title="¡Comparte esta web por WhatsApp!"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 3 }}
        >
          <MessageCircle size={26} fill="white" />
        </motion.div>
      </motion.button>
    </>
  )
}
