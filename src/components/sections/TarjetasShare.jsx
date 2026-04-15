/**
 * TarjetasShare — Carrusel tipo Stories con swipe, flechas y descarga
 * v3: personalización opcional (nombre+ciudad, mensaje) renderizada en el PNG exportado
 */
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Share2, UserCircle } from 'lucide-react'
import { openLink, getWhatsAppUrl, downloadImage } from '../../utils/shareUtils'
import { registrarShare } from '../../utils/difusionTracker'

const tarjetas = [
  {
    id: 1,
    frase: 'Del Chocó a la Casa de Nariño.',
    subfrase: 'Sin apellido. Sin partido. Con 1.2 millones de firmas.',
    bg: 'linear-gradient(135deg, #F5A623 0%, #2D7A3E 100%)',
    textColor: '#FFFFFF',
    hashtag: '#LGMurillo',
  },
  {
    id: 2,
    frase: '0 escándalos de corrupción.',
    subfrase: 'En más de 30 años de servicio público. Eso no es suerte. Es carácter.',
    bg: 'linear-gradient(135deg, #1A1A0F 0%, #2C2C1A 100%)',
    textColor: '#F5A623',
    hashtag: '#Colombia2026',
  },
  {
    id: 3,
    frase: 'Renunció a su ciudadanía americana para servir a Colombia.',
    subfrase: 'No como gesto. Porque era el requisito legal. Y lo hizo.',
    bg: 'linear-gradient(135deg, #1A56DB 0%, #1E3A8A 100%)',
    textColor: '#FFFFFF',
    hashtag: '#LGMurillo',
  },
  {
    id: 4,
    frase: '"La Paz Total no salió bien."',
    subfrase: 'Lo dijo él mismo. Honestidad sobre conveniencia.',
    bg: 'linear-gradient(135deg, #D97706 0%, #B91C1C 100%)',
    textColor: '#FFFFFF',
    hashtag: '#Colombia2026',
  },
  {
    id: 5,
    frase: 'La Colombia olvidada merece un presidente que la conoce por dentro.',
    subfrase: 'Nació en Andagoya, Chocó. No es un discurso. Es su historia.',
    bg: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
    textColor: '#FFFFFF',
    hashtag: '#LGMurillo',
  },
  {
    id: 6,
    frase: '31 de mayo. Un voto independiente es posible.',
    subfrase: 'Por primera vez en décadas, el Chocó puede dar un presidente a Colombia.',
    bg: 'linear-gradient(135deg, #F5A623 0%, #FDE68A 100%)',
    textColor: '#1A1A0F',
    hashtag: '#Colombia2026',
  },
]

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function TarjetasShare() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [touchStart, setTouchStart] = useState(null)
  const [generating, setGenerating] = useState(false)
  const cardRef = useRef(null)

  // Personalización opcional
  const [showPersonal, setShowPersonal] = useState(false)
  const [nombre, setNombre] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [mensajePersonal, setMensajePersonal] = useState('')

  const hasPersonalizacion = nombre.trim() || ciudad.trim() || mensajePersonal.trim()

  function navigate(dir) {
    setDirection(dir)
    setCurrent((prev) => (prev + dir + tarjetas.length) % tarjetas.length)
  }

  function goTo(i) {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1)
    setTouchStart(null)
  }

  async function handleDownload() {
    if (!cardRef.current) return
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      })
      downloadImage(canvas.toDataURL('image/png'), `lgm-tarjeta-${current + 1}.png`)
      registrarShare('tarjeta_png')
    } catch (err) {
      console.error('Error generando imagen:', err)
    } finally {
      setGenerating(false)
    }
  }

  function handleWhatsApp() {
    const t = tarjetas[current]
    const firmaPersonal = nombre.trim() ? `\n\n— ${nombre.trim()}${ciudad.trim() ? `, ${ciudad.trim()}` : ''}` : ''
    const text = `${t.frase}\n\n${t.subfrase}${firmaPersonal}\n\n${t.hashtag} #LGMurillo #Colombia2026\n\n🌐 Conoce más: lgm2026.co`
    openLink(getWhatsAppUrl(text))
    registrarShare('tarjeta_wa')
  }

  const tarjeta = tarjetas[current]

  return (
    <section id="tarjetas" className="py-20 bg-gray-50 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-mono tracking-widest text-amarillo uppercase mb-2">
            // Comparte · Dale visibilidad
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-textoPrincipal mb-2">
            Tarjetas para compartir
          </h2>
          <p className="text-textoSecundario font-body text-sm">
            Desliza · Descarga · Comparte por WhatsApp o Instagram Stories
          </p>
        </motion.div>

        {/* Carrusel */}
        <div
          className="relative overflow-hidden rounded-2xl select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: 'easeInOut' }}
            >
              {/* Tarjeta visual — la que se exporta con html2canvas */}
              <div
                ref={cardRef}
                className="w-full aspect-square flex flex-col justify-between rounded-2xl shadow-2xl overflow-hidden"
                style={{ background: tarjeta.bg }}
              >
                <div className="flex flex-col justify-between h-full p-8 sm:p-10">
                  {/* Header branding */}
                  <div
                    className="text-xs font-mono uppercase tracking-widest opacity-50"
                    style={{ color: tarjeta.textColor }}
                  >
                    LGM · Colombia 2026
                  </div>

                  {/* Contenido central */}
                  <div>
                    <p
                      className="font-display font-bold leading-tight mb-4"
                      style={{
                        color: tarjeta.textColor,
                        fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                      }}
                    >
                      {tarjeta.frase}
                    </p>
                    <p
                      className="font-body text-base leading-relaxed opacity-85"
                      style={{ color: tarjeta.textColor }}
                    >
                      {tarjeta.subfrase}
                    </p>
                  </div>

                  {/* Footer: personalización + branding */}
                  <div>
                    {/* Banda de personalización — solo aparece si hay datos */}
                    {hasPersonalizacion && (
                      <div
                        className="mb-3 pt-3 border-t"
                        style={{
                          borderColor: `${tarjeta.textColor}30`,
                        }}
                      >
                        {mensajePersonal.trim() && (
                          <p
                            className="font-body text-sm italic mb-1 opacity-90"
                            style={{ color: tarjeta.textColor }}
                          >
                            "{mensajePersonal.trim()}"
                          </p>
                        )}
                        {(nombre.trim() || ciudad.trim()) && (
                          <p
                            className="font-body text-xs opacity-70"
                            style={{ color: tarjeta.textColor }}
                          >
                            — {nombre.trim()}{ciudad.trim() ? `, ${ciudad.trim()}` : ''}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Branding fijo */}
                    <div
                      className="font-mono text-xs opacity-60"
                      style={{ color: tarjeta.textColor }}
                    >
                      {tarjeta.hashtag} · lgm2026.co
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flechas de navegación */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            aria-label="Tarjeta anterior"
          >
            <ChevronLeft size={20} className="text-textoPrincipal" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            aria-label="Tarjeta siguiente"
          >
            <ChevronRight size={20} className="text-textoPrincipal" />
          </button>
        </div>

        {/* Dots indicadores */}
        <div className="flex justify-center gap-2 mt-5">
          {tarjetas.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-amarillo w-6 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              }`}
              aria-label={`Ir a tarjeta ${i + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 font-body mt-2">
          {current + 1} / {tarjetas.length} — Desliza o usa las flechas
        </p>

        {/* Personalización opcional */}
        <div className="mt-5">
          <button
            onClick={() => setShowPersonal(!showPersonal)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-amarillo text-textoSecundario hover:text-textoPrincipal text-xs font-body font-semibold transition-all"
          >
            <UserCircle size={15} />
            {showPersonal ? 'Ocultar personalización' : '✏️ Personalizar tarjeta (opcional)'}
          </button>

          <AnimatePresence>
            {showPersonal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                  <p className="text-xs text-textoSecundario font-body leading-relaxed">
                    Añade tu firma a la tarjeta descargada. Es opcional — aparece como una banda al pie de la imagen.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-body font-semibold text-textoPrincipal mb-1">
                        Tu nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: María Rodríguez"
                        maxLength={40}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-body text-textoPrincipal focus:outline-none focus:border-amarillo transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-semibold text-textoPrincipal mb-1">
                        Ciudad / municipio
                      </label>
                      <input
                        type="text"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        placeholder="Ej: Quibdó"
                        maxLength={40}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-body text-textoPrincipal focus:outline-none focus:border-amarillo transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-textoPrincipal mb-1">
                      Tu mensaje (opcional, máx. 80 caracteres)
                    </label>
                    <input
                      type="text"
                      value={mensajePersonal}
                      onChange={(e) => setMensajePersonal(e.target.value.slice(0, 80))}
                      placeholder="Ej: Por mis hijos y por el Chocó"
                      maxLength={80}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-body text-textoPrincipal focus:outline-none focus:border-amarillo transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right font-body">
                      {mensajePersonal.length}/80
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-center mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={generating}
            className="flex items-center gap-2 bg-textoPrincipal text-white px-5 py-3 rounded-xl text-sm font-body font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg"
          >
            <Download size={16} />
            {generating ? 'Generando...' : 'Descargar PNG'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl text-sm font-body font-semibold hover:bg-green-600 transition-colors shadow-lg"
          >
            <Share2 size={16} />
            WhatsApp
          </motion.button>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { emoji: '📱', label: 'Desliza', desc: 'en mobile' },
            { emoji: '⬇️', label: 'Descarga', desc: 'PNG en alta calidad' },
            { emoji: '📤', label: 'Comparte', desc: 'WhatsApp o Stories' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="text-xl mb-1">{item.emoji}</div>
              <p className="font-body font-semibold text-textoPrincipal text-xs">{item.label}</p>
              <p className="font-body text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
