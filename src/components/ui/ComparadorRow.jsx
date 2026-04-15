/**
 * Fila del comparador de candidatos
 * Muestra íconos ✅ ⚠️ ❌ con tooltip al hover
 */
import { useState } from 'react'
import { Info } from 'lucide-react'

const TIPO_CONFIG = {
  bien: { icon: '✅', bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  neutral: { icon: '⚠️', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  mal: { icon: '❌', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
}

function CeldaTooltip({ valor, isLGM }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const config = TIPO_CONFIG[valor.tipo] || TIPO_CONFIG.neutral

  return (
    <td
      className={`p-3 text-center relative ${isLGM ? 'bg-yellow-50' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(!showTooltip)}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl">{config.icon}</span>
        <span className={`hidden md:block text-xs font-body leading-tight px-2 py-1 rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
          {valor.texto.length > 40 ? valor.texto.substring(0, 40) + '…' : valor.texto}
        </span>

        {/* Tooltip para mobile / hover full */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-52 bg-textoPrincipal text-white text-xs rounded-xl p-3 shadow-2xl font-body leading-snug text-left">
            <p>{valor.texto}</p>
          </div>
        )}
      </div>
    </td>
  )
}

export default function ComparadorRow({ criterio, candidatosActivos, fuente }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Label del criterio */}
      <td className="p-3 min-w-[140px]">
        <div className="flex items-start gap-1.5">
          <span className="font-body font-semibold text-sm text-textoPrincipal leading-tight">
            {criterio.label}
          </span>
          {fuente && (
            <div className="relative group flex-shrink-0 mt-0.5">
              <Info size={13} className="text-gray-400 cursor-help" />
              <div className="absolute left-0 top-full mt-1 z-30 w-52 bg-textoPrincipal text-white text-xs rounded-xl p-3 shadow-2xl font-body leading-snug opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Fuente: {fuente}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* Valores por candidato */}
      {candidatosActivos.map((candidatoId) => {
        const valor = criterio.valores[candidatoId]
        if (!valor) return <td key={candidatoId} className="p-3 text-center text-gray-300">—</td>
        return (
          <CeldaTooltip
            key={candidatoId}
            valor={valor}
            isLGM={candidatoId === 'lgm'}
          />
        )
      })}
    </tr>
  )
}
