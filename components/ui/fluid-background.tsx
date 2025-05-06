"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create blobs
    const blobs = [
      { color: "#0070F3", size: 300, opacity: 0.3 }, // Blue
      { color: "#00C2FF", size: 250, opacity: 0.2 }, // Cyan
      { color: "#8E33FF", size: 350, opacity: 0.15 }, // Purple
      { color: "#0070F3", size: 200, opacity: 0.25 }, // Blue
    ]

    // Clear any existing blobs
    containerRef.current.innerHTML = ""

    // Create and append blobs
    blobs.forEach((blob, index) => {
      const blobElement = document.createElement("div")
      blobElement.classList.add("fluid-blob")
      blobElement.style.width = `${blob.size}px`
      blobElement.style.height = `${blob.size}px`
      blobElement.style.backgroundColor = blob.color
      blobElement.style.opacity = blob.opacity.toString()

      // Random initial positions
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      blobElement.style.left = `${x}px`
      blobElement.style.top = `${y}px`

      containerRef.current?.appendChild(blobElement)

      // Animate with GSAP
      gsap.to(blobElement, {
        x: `random(-${window.innerWidth * 0.3}, ${window.innerWidth * 0.3})`,
        y: `random(-${window.innerHeight * 0.3}, ${window.innerHeight * 0.3})`,
        duration: 20 + index * 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Scale animation
      gsap.to(blobElement, {
        scale: "random(0.8, 1.2)",
        duration: 15 + index * 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    })

    return () => {
      // Cleanup GSAP animations
      gsap.killTweensOf(".fluid-blob")
    }
  }, [])

  return <div ref={containerRef} className="fluid-bg" />
}
