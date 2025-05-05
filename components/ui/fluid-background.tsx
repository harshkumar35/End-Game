"use client"

import { useEffect, useRef } from "react"

interface FluidBackgroundProps {
  className?: string
}

export function FluidBackground({ className = "" }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    const isDarkMode = document.documentElement.classList.contains("dark")

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define colors based on theme
    const colors = isDarkMode
      ? ["#1565C0", "#0288D1", "#7B1FA2", "#1976D2", "#388E3C"]
      : ["#64B5F6", "#81D4FA", "#B39DDB", "#90CAF9", "#A5D6A7"]

    // Create blobs
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 200 + 100,
      xSpeed: Math.random() * 0.2 - 0.1,
      ySpeed: Math.random() * 0.2 - 0.1,
      color: colors[i % colors.length],
      alpha: 0.1 + Math.random() * 0.1,
    }))

    // Animation loop
    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw blobs
      blobs.forEach((blob) => {
        // Move blob
        blob.x += blob.xSpeed
        blob.y += blob.ySpeed

        // Bounce off edges
        if (blob.x < 0 || blob.x > canvas.width) blob.xSpeed *= -1
        if (blob.y < 0 || blob.y > canvas.height) blob.ySpeed *= -1

        // Draw blob
        ctx.beginPath()
        ctx.filter = "blur(50px)"
        const radius = blob.radius + Math.sin(time) * 20
        ctx.ellipse(blob.x, blob.y, radius, radius * 0.8, 0, 0, Math.PI * 2)
        ctx.fillStyle = `${blob.color}${Math.floor(blob.alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()
        ctx.filter = "none"
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}
