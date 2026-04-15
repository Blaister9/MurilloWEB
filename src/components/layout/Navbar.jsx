/**
 * Barra de navegación principal
 * Se vuelve sólida al hacer scroll, tiene links a secciones y botón de compartir
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Share2 } from 'lucide-react'
import { useShare } from '../../hooks/useShare'

const NAV_LINKS = [
  { label: '¿Quién es?', href: '#quien-es' },
  { label: 'Propuestas', href: '#propuestas' },
  { label: 'Comparador', href: '#comparador' },
  { label: '¿Lo sabías?', href: '#datos-inesperados' },
  { label: 'Comparte', href: '#tarjetas' },
  { label: 'Quiz', href: '#quiz' },
  { label: 'Kit WhatsApp', href: '#kit-difusion' },
  { label: 'Apoya', href: '#apoya' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { share } = useShare()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(href) {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-md py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amarillo flex items-center justify-center font-impact text-textoPrincipal text-sm">
              LGM
            </div>
            <span
              className={`font-impact text-xl tracking-widest transition-colors ${
                scrolled ? 'text-textoPrincipal' : 'text-white'
              }`}
            >
              MURILLO 2026
            </span>
          </button>

          {/* Links desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-all hover:bg-amarillo/10 ${
                  scrolled ? 'text-textoSecundario hover:text-textoPrincipal' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA share + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => share({})}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-azulCTA text-white text-sm font-body font-semibold hover:bg-blue-700 transition-colors"
            >
              <Share2 size={14} />
              Compartir
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-textoPrincipal' : 'text-white'
              }`}
              aria-label="Menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[56px] left-0 right-0 z-30 bg-white shadow-xl lg:hidden overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-textoPrincipal font-body font-medium hover:bg-amarilloClaro transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { share({}); setMenuOpen(false) }}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-azulCTA text-white font-body font-semibold"
              >
                <Share2 size={16} />
                📲 Compartir esta página
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
