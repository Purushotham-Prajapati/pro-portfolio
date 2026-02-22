import { useState, useEffect, useRef } from 'react'

export function useCountUp(end: number, duration = 2000, startOnVisible = true) {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!startOnVisible) {
            startCounting()
            return
        }

        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true)
                    startCounting()
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasStarted]) // eslint-disable-line react-hooks/exhaustive-deps

    function startCounting() {
        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(end)
            return
        }

        const startTime = performance.now()
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }

    return { count, ref }
}
