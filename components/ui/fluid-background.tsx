"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create blobs
    const container = containerRef.current
    const colors = [
      "rgba(0, 114, 245, 0.2)", // Blue
      "rgba(0, 194, 255, 0.15)", // Cyan
      "rgba(142, 51, 255, 0.1)", // Purple
      "rgba(255, 45, 85, 0.08)", // Pink
    ]

    // Clear any existing blobs
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Create new blobs
    for (let i = 0; i < 4; i++) {
      const blob = document.createElement("div")
      blob.className = "fluid-blob"
      blob.style.backgroundColor = colors[i % colors.length]
      blob.style.width = `${Math.random() * 30 + 20}vw`
      blob.style.height = blob.style.width
      blob.style.left = `${Math.random() * 80}%`
      blob.style.top = `${Math.random() * 80}%`
      blob.style.opacity = "0"
      container.appendChild(blob)

      // Animate each blob with GSAP
      gsap.to(blob, {
        opacity: 0.8,
        duration: 2,
        delay: i * 0.3,
        ease: "power2.inOut",
      })

      // Create random movement animation
      gsap.to(blob, {
        x: `random(-30, 30)`,
        y: `random(-30, 30)`,
        scale: `random(0.8, 1.2)`,
        duration: `random(20, 40)`,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i,
      })

      // Create pulsing effect
      gsap.to(blob, {
        opacity: 0.4,
        duration: `random(4, 7)`,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
      })
    }

    // Cleanup
    return () => {
      gsap.killTweensOf(container.children)
    }
  }, [])

  return <div ref={containerRef} className="fluid-bg" />
}
