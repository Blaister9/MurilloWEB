/**
 * Stats.jsx — Página oculta /stats
 * Muestra analytics locales: resultados del quiz + shares por tipo
 * Solo es visible si el usuario navega directamente a /stats
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Share2, RefreshCw, Trash2 } from 'lucide-react'
import { obtenerEstadisticas, limpiarDatos } from '../../utils/quizAnalytics'
import { obtenerShares, limpiarShares } from '../../utils/difusionTracker'

const CANDIDATO_LABELS = {
  lgm: { label: 'Luis Gilberto Murillo', color: '#F5A623', emoji: '🟡' },
  cepeda: { label: 'Iván Cepeda', color: '#DC2626', emoji: '🔴' },
  paloma: { label: 'Paloma Valencia', color: '#1A56DB', emoji: '🔵' },
  espriella: { label: 'Rodrigo de la Espriella', color: '#059669', emoji: '🟢' },
}

function StatCard({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-amarillo" />
        <h3 className="font-display font-bold text-base text-textoPrincipal">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

function BarRow({ label, valor, total, emoji, color }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-body text-textoPrincipal">
          {emoji} {label}
        </span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>
          {pct}% ({valor})
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function Stats() {
  const [quizStats, setQuizStats] = useState(null)
  const [shareStats, setShareStats] = useState(null)
  const [limpiado, setLimpiado] = useState(false)

  function cargar() {
    setQuizStats(obtenerEstadisticas())
    setShareStats(obtenerShares())
    setLimpiado(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  useEffect(() => {
    // Ocultar esta página de Google
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => document.head.removeChild(meta)
  }, [])

  function handleLimpiar() {
    if (!window.confirm('¿Seguro que quieres borrar todos los datos locales? Esto no se puede deshacer.')) return
    limpiarDatos()
    limpiarShares()
    setQuizStats(null)
    setShareStats(null)
    setLimpiado(true)
  }

  const TIPO_LABELS = {
    whatsapp: 'WhatsApp directo',
    copia: 'Copiar texto',
    estado: 'Estado WA',
    regional: 'Mensaje regional',
    regional_wa: 'Región → WhatsApp',
    tarjeta_png: 'Tarjeta PNG',
    tarjeta_wa: 'Tarjeta WA',
    general: 'General',
  }

  return (
    <div className="min-h-screen bg-fondo py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-mono font-semibold mb-3 uppercase tracking-wider">
            /stats — solo tú ves esto
          </span>
          <h1 className="font-display font-bold text-3xl text-textoPrincipal mb-2">
            Analytics locales
          </h1>
          <p className="text-textoSecundario font-body text-sm">
            Datos guardados en este navegador. No se envían a ningún servidor.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Quiz stats */}
          <StatCard title="Resultados del Quiz" icon={BarChart2}>
            {quizStats ? (
              <>
                <p className="text-xs text-textoSecundario font-body mb-4">
                  Total de quizzes completados en este dispositivo: <strong>{quizStats.total}</strong>
                </p>
                {Object.entries(quizStats.conteo).map(([candidato, count]) => {
                  const meta = CANDIDATO_LABELS[candidato] || { label: candidato, color: '#888', emoji: '⚪' }
                  return (
                    <BarRow
                      key={candidato}
                      label={meta.label}
                      valor={count}
                      total={quizStats.total}
                      emoji={meta.emoji}
                      color={meta.color}
                    />
                  )
                })}
              </>
            ) : (
              <p className="text-sm font-body text-gray-400 text-center py-4">
                {limpiado ? '✅ Datos borrados.' : 'Aún no hay quizzes completados en este dispositivo.'}
              </p>
            )}
          </StatCard>

          {/* Share stats */}
          <StatCard title="Conteo de shares" icon={Share2}>
            {shareStats && shareStats.total > 0 ? (
              <>
                <p className="text-xs text-textoSecundario font-body mb-4">
                  Total de shares registrados: <strong>{shareStats.total}</strong>
                  {shareStats.badge && (
                    <span className="ml-2 font-semibold" style={{ color: '#F5A623' }}>
                      {shareStats.badge.emoji} {shareStats.badge.label}
                    </span>
                  )}
                </p>
                {Object.entries(shareStats.detalle).length > 0 ? (
                  Object.entries(shareStats.detalle)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tipo, count]) => (
                      <BarRow
                        key={tipo}
                        label={TIPO_LABELS[tipo] || tipo}
                        valor={count}
                        total={shareStats.total}
                        emoji="📤"
                        color="#2D7A3E"
                      />
                    ))
                ) : (
                  <p className="text-xs text-gray-400 font-body">Sin desglose disponible.</p>
                )}
              </>
            ) : (
              <p className="text-sm font-body text-gray-400 text-center py-4">
                {limpiado ? '✅ Datos borrados.' : 'Aún no hay shares registrados en este dispositivo.'}
              </p>
            )}
          </StatCard>

          {/* Acciones */}
          <div className="flex gap-3 justify-center mt-2">
            <button
              onClick={cargar}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-textoPrincipal text-xs font-body font-semibold transition-colors"
            >
              <RefreshCw size={13} />
              Actualizar
            </button>
            <button
              onClick={handleLimpiar}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-body font-semibold transition-colors border border-red-200"
            >
              <Trash2 size={13} />
              Borrar todos los datos
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 font-body mt-2">
            Estos datos son solo tuyos — en tu navegador, en tu dispositivo.
            Nunca se envían a ningún servidor.
          </p>
        </div>
      </div>
    </div>
  )
}
