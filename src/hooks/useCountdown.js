import { useState, useEffect } from 'react'
import { SITE_CONFIG } from '../config.js'

function calcularDiff(target) {
  const ahora = Date.now()
  const diff = target.getTime() - ahora
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true }

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    segundos: Math.floor((diff % (1000 * 60)) / 1000),
    terminado: false
  }
}

export function useCountdown(target = SITE_CONFIG.eleccion) {
  const [tiempo, setTiempo] = useState(() => calcularDiff(target))

  useEffect(() => {
    let intervalo

    const tick = () => setTiempo(calcularDiff(target))

    const iniciar = () => {
      tick()
      intervalo = setInterval(tick, 1000)
    }

    const detener = () => clearInterval(intervalo)

    // Solo correr cuando la pestania es visible
    if (document.visibilityState === 'visible') iniciar()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') iniciar()
      else detener()
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      detener()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [target])

  return tiempo
}
