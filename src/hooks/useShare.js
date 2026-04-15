/**
 * Hook para manejar sharing nativo + fallback modal
 */
import { useState, useCallback } from 'react'
import { shareNative, getWhatsAppUrl, getTwitterUrl, openLink, SHARE_URL } from '../utils/shareUtils'

export function useShare() {
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({ text: '', url: '' })

  const share = useCallback(async ({ title, text, url } = {}) => {
    const shareText = text || 'Conoce a Luis Gilberto Murillo 🇨🇴 #LGMurillo #Colombia2026'
    const shareUrl = url || SHARE_URL

    const result = await shareNative({ title, text: shareText, url: shareUrl })

    if (!result.success) {
      // Mostrar modal de fallback
      setModalData({ text: shareText, url: shareUrl })
      setShowModal(true)
    }
  }, [])

  const shareWhatsApp = useCallback(({ text, url } = {}) => {
    openLink(getWhatsAppUrl(text, url))
  }, [])

  const shareTwitter = useCallback(({ text, url } = {}) => {
    openLink(getTwitterUrl(text, url))
  }, [])

  const closeModal = useCallback(() => setShowModal(false), [])

  return {
    share,
    shareWhatsApp,
    shareTwitter,
    showModal,
    modalData,
    closeModal,
  }
}
