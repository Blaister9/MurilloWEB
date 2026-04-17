/**
 * difusionTracker.js — Contador local de shares (sin backend)
 * Guarda el número de veces que el usuario ha compartido contenido
 * y devuelve un badge motivacional según el nivel alcanzado.
 */

const STORAGE_KEY = 'lgm_shares_count'

const BADGES = [
  { minShares: 1,  emoji: '🌱', label: 'Sembrador', mensaje: '¡Gracias por compartir!' },
  { minShares: 3,  emoji: '📣', label: 'Vocero',    mensaje: '¡Llevas 3 shares! Eres voz del cambio.' },
  { minShares: 7,  emoji: '🔥', label: 'Activista', mensaje: '¡7 shares! La Colombia olvidada te escucha.' },
  { minShares: 15, emoji: '🚀', label: 'Líder',     mensaje: '¡15 shares! Eres un líder de opinión.' },
  { minShares: 30, emoji: '🏆', label: 'Campeón',   mensaje: '¡30+ shares! Leyenda de la difusión digital.' },
]

/**
 * Registra un nuevo share y devuelve el estado actualizado.
 * @param {string} tipo - tipo de share ('whatsapp' | 'twitter' | 'tarjeta' | 'quiz' | 'kit')
 * @returns {{ total: number, badge: Object|null }}
 */
// SSG guard: localStorage solo disponible en el browser
const safeStorage = typeof localStorage !== 'undefined' ? localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export function registrarShare(tipo = 'general') {
  try {
    const data = JSON.parse(safeStorage.getItem(STORAGE_KEY) || '{"total":0,"detalle":{}}')
    data.total = (data.total || 0) + 1
    data.detalle[tipo] = (data.detalle[tipo] || 0) + 1
    data.ultimoShare = new Date().toISOString()
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return { total: data.total, badge: obtenerBadge(data.total) }
  } catch {
    return { total: 0, badge: null }
  }
}

/**
 * Obtiene el conteo actual de shares.
 * @returns {{ total: number, detalle: Object, badge: Object|null }}
 */
export function obtenerShares() {
  try {
    const data = JSON.parse(safeStorage.getItem(STORAGE_KEY) || '{"total":0,"detalle":{}}')
    return {
      total: data.total || 0,
      detalle: data.detalle || {},
      badge: obtenerBadge(data.total || 0),
    }
  } catch {
    return { total: 0, detalle: {}, badge: null }
  }
}

/**
 * Devuelve el badge correspondiente al número de shares.
 * @param {number} total
 * @returns {Object|null}
 */
export function obtenerBadge(total) {
  if (total <= 0) return null
  // El badge más alto que el usuario ha alcanzado
  const logros = BADGES.filter(b => total >= b.minShares)
  return logros.length > 0 ? logros[logros.length - 1] : null
}

/**
 * Limpia los datos de shares (para testing).
 */
export function limpiarShares() {
  try {
    safeStorage.removeItem(STORAGE_KEY)
  } catch {
    // silencioso
  }
}
