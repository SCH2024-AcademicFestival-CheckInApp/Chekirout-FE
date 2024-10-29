'use client'

import { useEffect } from 'react'

export default function ZoomPreventProvider({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventDoubleTapZoom = (() => {
      let lastTouchEnd = 0
      return function (e: TouchEvent) {
        const now = Date.now()
        if (now - lastTouchEnd < 300) {
          e.preventDefault()
        }
        lastTouchEnd = now
      }
    })()

    document.addEventListener('touchmove', preventZoom, { passive: false })
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventZoom)
      document.removeEventListener('touchend', preventDoubleTapZoom)
    }
  }, [])

  return <>{children}</>
}