/**
 * quizAnalytics.js — Analytics locales del quiz (sin backend, sin datos personales)
 * Almacena resultados en localStorage bajo la clave lgm_quiz_results
 */

const STORAGE_KEY = 'lgm_quiz_results'

/**
 * Guarda el resultado de un quiz completado.
 * @param {Object} respuestas - { preguntaId: candidatoId }
 * @param {string} candidatoFinal - id del candidato ganador
 */
export function guardarResultado(respuestas, candidatoFinal) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const nuevo = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      resultado: candidatoFinal,
      respuestas: Object.entries(respuestas).map(([preguntaId, candidatoElegido]) => ({
        preguntaId: Number(preguntaId),
        candidatoElegido,
      })),
    }
    existing.push(nuevo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch {
    // Fallo silencioso — el quiz sigue funcionando igual
  }
}

/**
 * Devuelve estadísticas agregadas de todos los quizzes completados en este dispositivo.
 * @returns {Object|null} null si no hay datos
 */
export function obtenerEstadisticas() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (data.length === 0) return null

    const conteo = data.reduce((acc, r) => {
      acc[r.resultado] = (acc[r.resultado] || 0) + 1
      return acc
    }, {})

    const total = data.length

    return {
      total,
      conteo,
      porcentajes: Object.fromEntries(
        Object.entries(conteo).map(([k, v]) => [k, Math.round((v / total) * 100)])
      ),
      ultimoResultado: data[data.length - 1]?.resultado ?? null,
    }
  } catch {
    return null
  }
}

/**
 * Limpia todos los datos del quiz (para testing).
 */
export function limpiarDatos() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // silencioso
  }
}
