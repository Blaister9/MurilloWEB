/**
 * Banner de modo bajo consumo — aparece automáticamente en conexiones 2G/slow-2G
 * También tiene un banner de "iniciativa ciudadana" siempre visible
 */
import { useState } from 'react'
import { X, Wifi, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function LowBandwidthBanner({ isSlowConnection }) {
  const [dismissed, setDismissed] = useState(false)

  if (!isSlowConnection || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-blue-600 text-white overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-body">
            <Wifi size={14} className="flex-shrink-0 opacity-80" />
            <span>
              📶 <strong>Modo bajo consumo activado</strong> — la página usa menos datos para
              que cargue rápido en tu conexión.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Cerrar aviso"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function CitizenBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-body text-gray-600">
          <Info size={12} className="flex-shrink-0 text-gray-400" />
          <span>
            Esta es una <strong>iniciativa ciudadana independiente</strong> — no es la web
            oficial de la campaña. Verificamos cada dato con fuentes públicas.{' '}
            <button
              onClick={() =>
                document.querySelector('#apoya')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-azulCTA hover:underline font-medium"
            >
              Ver fuentes →
            </button>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar aviso"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
