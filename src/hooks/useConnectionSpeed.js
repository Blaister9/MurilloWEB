import { useState, useEffect } from 'react'

export function useConnectionSpeed() {
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    if (connection) {
      // Chromium: usar Network Information API
      const check = () => {
        setIsSlowConnection(
          connection.effectiveType === '2g' ||
          connection.effectiveType === 'slow-2g' ||
          connection.downlink < 1
        )
      }
      check()
      connection.addEventListener('change', check)
      return () => connection.removeEventListener('change', check)
    }

    // Safari / Firefox: fallback con Performance API
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav && nav.transferSize > 0) {
      const duracion = nav.responseEnd - nav.requestStart
      const bytesPerMs = nav.transferSize / (duracion || 1)
      // <5 bytes/ms aprox conexion muy lenta (~40 kbps)
      setIsSlowConnection(bytesPerMs < 5)
    }
  }, [])

  return { isSlowConnection }
}
