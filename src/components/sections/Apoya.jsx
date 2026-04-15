/**
 * Sección Apoya — Formulario simple + links a redes sociales
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Send, Heart, Share2 } from 'lucide-react'
import { useShare } from '../../hooks/useShare'

export default function Apoya() {
  const [form, setForm] = useState({ nombre: '', whatsapp: '' })
  const [submitted, setSubmitted] = useState(false)
  const { share } = useShare()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre || !form.whatsapp) return

    // Construir mailto como fallback sin backend
    const subject = encodeURIComponent('Quiero apoyar a LGM Murillo 2026')
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nWhatsApp: ${form.whatsapp}\n\n#LGMurillo #Colombia2026`
    )
    window.open(`mailto:apoyo@lgm2026.co?subject=${subject}&body=${body}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="apoya" className="py-20 px-4 bg-gradient-to-br from-verde to-[#1A3A0F]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-body font-semibold mb-3 uppercase tracking-wider">
            Únete al movimiento
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            ¿Quieres apoyar a LGM?
          </h2>
          <p className="text-white/80 font-body text-base max-w-xl mx-auto">
            Déjanos tu nombre y WhatsApp. Un voluntario de la campaña se pondrá en contacto contigo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="font-display font-semibold text-white text-xl mb-5 text-left">
                  Quiero apoyar
                </h3>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-white/80 text-xs font-body font-medium mb-1.5 text-left uppercase tracking-wider">
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="¿Cómo te llamas?"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-textoPrincipal font-body text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amarillo transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-xs font-body font-medium mb-1.5 text-left uppercase tracking-wider">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      placeholder="+57 300 000 0000"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-textoPrincipal font-body text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amarillo transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amarillo hover:bg-yellow-400 text-textoPrincipal font-body font-bold text-sm transition-all shadow-lg active:scale-95"
                  >
                    <Heart size={16} />
                    Quiero apoyar a LGM
                  </button>
                </div>

                <p className="mt-3 text-white/50 text-xs font-body text-center">
                  Sitio ciudadano independiente. No spam. Solo contacto de la campaña.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
              >
                <div className="text-5xl mb-4">🇨🇴</div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  ¡Gracias, {form.nombre}!
                </h3>
                <p className="text-white/80 font-body text-sm">
                  Un voluntario de la campaña se pondrá en contacto contigo pronto.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Redes + share */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="font-display font-semibold text-white text-lg mb-4 text-left">
                Síguelo en redes
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Twitter,
                    label: '@LuisGMurillo',
                    url: 'https://twitter.com/LuisGMurillo',
                    desc: 'X (Twitter)',
                    color: 'hover:bg-white/20',
                  },
                  {
                    icon: Instagram,
                    label: '@lgmurillo',
                    url: 'https://instagram.com/lgmurillo',
                    desc: 'Instagram',
                    color: 'hover:bg-pink-500/20',
                  },
                ].map((red) => {
                  const Icon = red.icon
                  return (
                    <a
                      key={red.label}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border border-white/20 text-white transition-all ${red.color}`}
                    >
                      <Icon size={18} />
                      <div className="text-left">
                        <p className="font-body font-semibold text-sm">{red.label}</p>
                        <p className="font-body text-xs text-white/60">{red.desc}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Share */}
            <button
              onClick={() =>
                share({
                  title: 'Apoya a Luis Gilberto Murillo — Colombia 2026',
                  text: '¡Me uní al movimiento de Luis Gilberto Murillo! Sin partido, sin escándalos, con 1.2M de firmas. 🇨🇴 #LGMurillo #Colombia2026',
                })
              }
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-azulCTA hover:bg-blue-600 text-white font-body font-bold text-sm transition-all shadow-lg"
            >
              <Share2 size={16} />
              📲 Comparte este movimiento
            </button>

            {/* Quote final */}
            <blockquote className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-left">
              <p className="font-display italic text-white text-sm leading-relaxed">
                "El cambio en Colombia no vendrá de los mismos de siempre.
                Vendrá de los que nunca habían tenido voz."
              </p>
              <cite className="mt-2 block text-white/60 text-xs font-body not-italic">
                — Luis Gilberto Murillo
              </cite>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
