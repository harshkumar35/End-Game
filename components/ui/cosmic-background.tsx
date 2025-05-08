"use client"

import { useEffect, useRef } from "react"

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create stars
    const stars: {
      x: number
      y: number
      radius: number
      color: string
      alpha: number
      speed: number
      direction: number
    }[] = []

    // Create nebula clouds
    const nebulae: {
      x: number
      y: number
      radius: number
      color: string
      alpha: number
    }[] = []

    // Initialize stars
    const initStars = () => {
      stars.length = 0
      const starCount = Math.floor((canvas.width * canvas.height) / 5000)

      for (let i = 0; i < starCount; i++) {
        const radius = Math.random() * 1.5 + 0.5
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius,
          color: `hsl(${Math.random() * 60 + 200}, 100%, 80%)`,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.01,
          direction: Math.random() * Math.PI * 2,
        })
      }
    }

    // Initialize nebulae
    const initNebulae = () => {
      nebulae.length = 0
      const nebulaCount = 5

      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 200,
          color:
            i % 2 === 0 ? `hsl(${Math.random() * 40 + 200}, 100%, 50%)` : `hsl(${Math.random() * 40 + 160}, 100%, 50%)`,
          alpha: Math.random() * 0.05 + 0.02,
        })
      }
    }

    initStars()
    initNebulae()

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      // Draw nebulae
      nebulae.forEach((nebula, i) => {
        const grd = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius)

        grd.addColorStop(0, `${nebula.color}`)
        grd.addColorStop(1, "rgba(0,0,0,0)")

        ctx.globalAlpha = nebula.alpha * (Math.sin(time * 0.2 + i) * 0.2 + 0.8)
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
        ctx.fill()

        // Slowly move nebulae
        nebula.x += Math.sin(time * 0.1 + i) * 0.2
        nebula.y += Math.cos(time * 0.1 + i) * 0.2

        // Wrap around edges
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius
      })

      // Draw stars
      ctx.globalAlpha = 1
      stars.forEach((star, i) => {
        // Twinkle effect
        const flicker = Math.sin(time * 3 + i) * 0.2 + 0.8

        ctx.fillStyle = star.color
        ctx.globalAlpha = star.alpha * flicker
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()

        // Move stars
        star.x += Math.cos(star.direction) * star.speed
        star.y += Math.sin(star.direction) * star.speed

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: "linear-gradient(to bottom, #040714, #0a1128)" }}
      aria-hidden="true"
    />
  )
}
