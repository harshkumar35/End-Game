"use client"

import { useEffect, useRef } from "react"

export function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions
      const setCanvasDimensions = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      setCanvasDimensions()
      window.addEventListener("resize", setCanvasDimensions)

      // Create stars
      const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []
      const createStars = () => {
        stars.length = 0 // Clear existing stars
        const starCount = Math.floor((canvas.width * canvas.height) / 10000)

        for (let i = 0; i < starCount; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            opacity: Math.random(),
            speed: 0.05 + Math.random() * 0.1,
          })
        }
      }

      createStars()
      window.addEventListener("resize", createStars)

      // Animation variables
      let animationFrameId: number
      let time = 0

      // Animation function
      const animate = () => {
        try {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          time += 0.005

          // Draw stars
          stars.forEach((star) => {
            const flickerAmount = Math.sin(time * star.speed) * 0.3 + 0.7
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * flickerAmount})`
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
            ctx.fill()
          })

          animationFrameId = requestAnimationFrame(animate)
        } catch (error) {
          console.error("Animation error:", error)
          cancelAnimationFrame(animationFrameId)
        }
      }

      // Start animation
      animate()

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener("resize", setCanvasDimensions)
        window.removeEventListener("resize", createStars)
      }
    } catch (error) {
      console.error("Universe background error:", error)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
}
