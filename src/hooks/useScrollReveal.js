/**
 * Hook para detectar cuando un elemento entra en el viewport
 * Útil para triggerear animaciones de Framer Motion
 */
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Una vez visible, no necesitamos seguir observando
          if (!options.repeat) {
            observer.unobserve(element)
          }
        } else if (options.repeat) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.repeat])

  return { ref, isVisible }
}
