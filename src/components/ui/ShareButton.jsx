/**
 * Botón de sharing reutilizable
 * Props: text, url, label, variant ('primary'|'whatsapp'|'twitter'|'download')
 */
import { useState } from 'react'
import { Share2, MessageCircle, Twitter, Download, X } from 'lucide-react'
import { useShare } from '../../hooks/useShare'
import { getWhatsAppUrl, getTwitterUrl, openLink } from '../../utils/shareUtils'

const VARIANTS = {
  primary: {
    bg: 'bg-azulCTA hover:bg-blue-700',
    text: 'text-white',
    icon: Share2,
    label: '📲 Compartir',
  },
  whatsapp: {
    bg: 'bg-green-500 hover:bg-green-600',
    text: 'text-white',
    icon: MessageCircle,
    label: 'WhatsApp',
  },
  twitter: {
    bg: 'bg-black hover:bg-gray-800',
    text: 'text-white',
    icon: Twitter,
    label: 'X (Twitter)',
  },
  download: {
    bg: 'bg-amarillo hover:bg-yellow-500',
    text: 'text-textoPrincipal',
    icon: Download,
    label: 'Descargar',
  },
}

export default function ShareButton({
  text,
  url,
  label,
  variant = 'primary',
  className = '',
  size = 'md',
  onDownload,
}) {
  const { share, showModal, modalData, closeModal } = useShare()
  const v = VARIANTS[variant] || VARIANTS.primary
  const Icon = v.icon

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  function handleClick() {
    if (variant === 'whatsapp') {
      openLink(getWhatsAppUrl(text, url))
    } else if (variant === 'twitter') {
      openLink(getTwitterUrl(text, url))
    } else if (variant === 'download' && onDownload) {
      onDownload()
    } else {
      share({ text, url })
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center font-body font-semibold rounded-xl transition-all duration-200 active:scale-95 ${v.bg} ${v.text} ${sizeClasses[size] || sizeClasses.md} ${className}`}
        aria-label={label || v.label}
      >
        <Icon size={size === 'lg' ? 20 : 16} />
        <span>{label || v.label}</span>
      </button>

      {/* Fallback Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-textoPrincipal">
                Compartir
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-textoSecundario text-sm mb-5 font-body">{modalData.text}</p>

            <div className="flex flex-col gap-3">
              <ShareButton
                variant="whatsapp"
                text={modalData.text}
                url={modalData.url}
                label="Compartir por WhatsApp"
                size="lg"
                className="w-full"
              />
              <ShareButton
                variant="twitter"
                text={modalData.text}
                url={modalData.url}
                label="Compartir en X (Twitter)"
                size="lg"
                className="w-full"
              />
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center font-body">
              {modalData.url}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
