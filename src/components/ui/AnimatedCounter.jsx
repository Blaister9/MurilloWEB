/**
 * Contador animado que se activa cuando entra en viewport
 * Props: value (number), suffix (string), prefix (string), duration (ms)
 */
import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}) {
  const [count, setCount] = useState(0)
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const numericValue = parseFloat(value)

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentCount = easedProgress * numericValue

      // Formatear con punto como separador de miles para Colombia
      if (numericValue >= 1000) {
        setCount(Math.floor(currentCount).toLocaleString('es-CO'))
      } else if (Number.isInteger(numericValue)) {
        setCount(Math.floor(currentCount))
      } else {
        setCount(currentCount.toFixed(1))
      }

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        if (numericValue >= 1000) {
          setCount(numericValue.toLocaleString('es-CO'))
        } else {
          setCount(value)
        }
      }
    }

    requestAnimationFrame(update)
  }, [isVisible, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
