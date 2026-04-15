/**
 * Hook para detectar velocidad de conexión del usuario
 * Útil para activar modo bajo consumo en zonas con conectividad limitada
 * Basado en Network Information API (Chrome/Android)
 */
import { useState, useEffect } from 'react'

export function useConnectionSpeed() {
  const [connectionType, setConnectionType] = useState('unknown')
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    function updateConnection() {
      if (!connection) {
        setConnectionType('unknown')
        setIsSlowConnection(false)
        return
      }

      const type = connection.effectiveType || 'unknown'
      setConnectionType(type)
      // 'slow-2g' o '2g' = modo bajo consumo
      setIsSlowConnection(type === 'slow-2g' || type === '2g')
    }

    updateConnection()

    if (connection) {
      connection.addEventListener('change', updateConnection)
      return () => connection.removeEventListener('change', updateConnection)
    }
  }, [])

  return { connectionType, isSlowConnection }
}
