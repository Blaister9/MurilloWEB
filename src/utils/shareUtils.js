/**
 * Utilidades de sharing para MurilloWEB
 * Soporta Web Share API nativa + fallbacks a WhatsApp y X (Twitter)
 */

export const SHARE_URL = 'https://murillopresident.netlify.app'

export const DEFAULT_SHARE_TEXT = `Conoce a Luis Gilberto Murillo, el candidato independiente del Chocó 🇨🇴
Sin partido. Sin jefe. Sin escándalos. #LGMurillo #Colombia2026`

/**
 * Intenta usar la Web Share API nativa.
 * Si no está disponible, abre un modal de fallback (retorna false para que el componente lo maneje).
 */
export async function shareNative({ title, text, url } = {}) {
  const shareData = {
    title: title || 'Luis Gilberto Murillo — La Colombia Olvidada',
    text: text || DEFAULT_SHARE_TEXT,
    url: url || SHARE_URL,
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return { success: true, method: 'native' }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share API falló, usando fallback:', err)
      }
      return { success: false, method: 'native', error: err }
    }
  }
  return { success: false, method: 'unavailable' }
}

/**
 * Construye URL de WhatsApp para compartir
 */
export function getWhatsAppUrl(text, url) {
  const fullText = `${text || DEFAULT_SHARE_TEXT}\n${url || SHARE_URL}`
  return `https://wa.me/?text=${encodeURIComponent(fullText)}`
}

/**
 * Construye URL de X (Twitter) para compartir
 */
export function getTwitterUrl(text, url) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text || DEFAULT_SHARE_TEXT
  )}&url=${encodeURIComponent(url || SHARE_URL)}`
}

/**
 * Abre un link en nueva pestaña de forma segura
 */
export function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Descarga un canvas/imagen como PNG
 */
export function downloadImage(dataUrl, filename = 'lgm-murillo.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
