/**
 * Kit de difusión para WhatsApp — v3
 * Tabs: Mensajes de texto | Estados WA | Por región
 * Share counter badge con difusionTracker
 * Sin scripts de audio (eliminados en v3)
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, MessageCircle, MapPin } from 'lucide-react'
import { mensajes, estadosWA, mensajesRegionales } from '../../data/mensajesWhatsapp'
import { getWhatsAppUrl, openLink } from '../../utils/shareUtils'
import { registrarShare, obtenerShares } from '../../utils/difusionTracker'

// ─── Componente: Badge de nivel de difusión ───────────────────────────────────
function BadgeDifusion({ badge, total }) {
  if (!badge) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amarilloClaro border border-yellow-300 rounded-full text-xs font-body font-semibold text-textoPrincipal"
    >
      <span className="text-base">{badge.emoji}</span>
      <span>{badge.label}</span>
      <span className="text-gray-500">· {total} {total === 1 ? 'share' : 'shares'}</span>
    </motion.div>
  )
}

// ─── Componente: Tarjeta de mensaje ───────────────────────────────────────────
function MensajeCard({ mensaje, onShare }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(mensaje.texto)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = mensaje.texto
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare('copia')
  }

  function handleWhatsApp() {
    openLink(getWhatsAppUrl(mensaje.texto))
    onShare('whatsapp')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xl">{mensaje.emoji}</span>
        <span className="font-body font-semibold text-sm text-textoPrincipal">{mensaje.titulo}</span>
      </div>
      <div className="px-4 py-4">
        <pre className="font-body text-xs text-textoSecundario leading-relaxed whitespace-pre-wrap break-words">
          {mensaje.texto}
        </pre>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-body font-semibold transition-all ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 hover:bg-gray-200 text-textoPrincipal'
          }`}
        >
          {copied ? <><Check size={13} />¡Copiado!</> : <><Copy size={13} />Copiar texto</>}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-body font-semibold transition-colors"
        >
          <MessageCircle size={13} />
          Enviar por WhatsApp
        </button>
      </div>
    </motion.div>
  )
}

// ─── Componente: Estado de WhatsApp (texto corto ≤700 chars) ─────────────────
function EstadoCard({ estado, onShare }) {
  const [copied, setCopied] = useState(false)
  const chars = estado.texto.length

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(estado.texto)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = estado.texto
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare('estado')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center justify-between">
        <span className="font-body font-semibold text-sm text-textoPrincipal">{estado.titulo}</span>
        <span className={`font-mono text-xs ${chars > 650 ? 'text-orange-500' : 'text-gray-400'}`}>
          {chars}/700
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="font-body text-sm text-textoSecundario leading-relaxed">{estado.texto}</p>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-body font-semibold transition-all ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {copied ? <><Check size={13} />¡Copiado! Pégalo en tu Estado de WhatsApp</> : <><Copy size={13} />Copiar para Estado de WhatsApp</>}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Componente: Selector regional ───────────────────────────────────────────
function RegionalTab({ onShare }) {
  const [regionActiva, setRegionActiva] = useState(null)
  const [copied, setCopied] = useState(false)
  const regiones = Object.entries(mensajesRegionales)

  async function handleCopy(texto) {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = texto
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare('regional')
  }

  function handleWA(texto) {
    openLink(getWhatsAppUrl(texto))
    onShare('regional_wa')
  }

  const datos = regionActiva ? mensajesRegionales[regionActiva] : null

  return (
    <div>
      <p className="text-sm font-body text-textoSecundario mb-4 leading-relaxed">
        Cada región de Colombia tiene su contexto. Elige la tuya para ver un mensaje adaptado:
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {regiones.map(([key, r]) => (
          <button
            key={key}
            onClick={() => { setRegionActiva(key); setCopied(false) }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-semibold border-2 transition-all ${
              regionActiva === key
                ? 'bg-verde text-white border-verde'
                : 'bg-white text-textoPrincipal border-gray-200 hover:border-verde/50'
            }`}
          >
            <span>{r.emoji}</span>
            {r.label}
            <MapPin size={11} className="opacity-60" />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {datos && (
          <motion.div
            key={regionActiva}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <span className="text-xl">{datos.emoji}</span>
              <span className="font-body font-semibold text-sm text-textoPrincipal">
                Mensaje para el {datos.label}
              </span>
            </div>
            <div className="px-4 py-4">
              <pre className="font-body text-xs text-textoSecundario leading-relaxed whitespace-pre-wrap break-words">
                {datos.texto}
              </pre>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => handleCopy(datos.texto)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-body font-semibold transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-textoPrincipal'
                }`}
              >
                {copied ? <><Check size={13} />¡Copiado!</> : <><Copy size={13} />Copiar</>}
              </button>
              <button
                onClick={() => handleWA(datos.texto)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-body font-semibold transition-colors"
              >
                <MessageCircle size={13} />
                Enviar por WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!regionActiva && (
        <div className="text-center py-8 text-gray-300 text-4xl">
          <MapPin size={40} className="mx-auto opacity-30" />
          <p className="text-sm font-body text-gray-400 mt-2">Selecciona tu región arriba</p>
        </div>
      )}
    </div>
  )
}

// ─── Sección principal ────────────────────────────────────────────────────────
const TABS = [
  { id: 'mensajes', label: '💬 Mensajes' },
  { id: 'estados', label: '📲 Estados WA' },
  { id: 'regional', label: '🗺️ Por región' },
]

export default function KitWhatsapp() {
  const [activeTab, setActiveTab] = useState('mensajes')
  const [shareStats, setShareStats] = useState({ total: 0, badge: null })

  useEffect(() => {
    setShareStats(obtenerShares())
  }, [])

  function handleShare(tipo) {
    const resultado = registrarShare(tipo)
    setShareStats({ total: resultado.total, badge: resultado.badge })
  }

  return (
    <section id="kit-difusion" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Difusión masiva
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-textoPrincipal mb-3">
            Kit de difusión WhatsApp
          </h2>
          <p className="text-textoSecundario font-body text-sm max-w-xl mx-auto mb-4">
            Mensajes listos para copiar y reenviar. Con ángulos distintos según tu audiencia —
            historia personal, honestidad incómoda, pregunta reflexiva, dato concreto.
          </p>
          {/* Badge de difusión */}
          <BadgeDifusion badge={shareStats.badge} total={shareStats.total} />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-body font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-textoPrincipal'
                  : 'text-textoSecundario hover:text-textoPrincipal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <AnimatePresence mode="wait">
          {activeTab === 'mensajes' && (
            <motion.div
              key="mensajes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {mensajes.map((m) => (
                <MensajeCard key={m.id} mensaje={m} onShare={handleShare} />
              ))}
            </motion.div>
          )}

          {activeTab === 'estados' && (
            <motion.div
              key="estados"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
                <p className="text-sm font-body text-green-800 leading-relaxed">
                  <strong>¿Para qué sirven los Estados?</strong> Un Estado de WhatsApp dura 24h y
                  llega a todos tus contactos automáticamente. Máximo 700 caracteres.
                  Elige uno, cópialo y pégalo en "Estado" de WhatsApp.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {estadosWA.map((e) => (
                  <EstadoCard key={e.id} estado={e} onShare={handleShare} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'regional' && (
            <motion.div
              key="regional"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RegionalTab onShare={handleShare} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nota de transparencia */}
        <p className="mt-8 text-center text-xs text-gray-400 font-body">
          Estos mensajes son de difusión ciudadana voluntaria. Nadie te paga por compartirlos.
        </p>
      </div>
    </section>
  )
}
