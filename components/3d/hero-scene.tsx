"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Get container dimensions
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x581c87) // Deep purple background to match our theme

    // Create camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 5

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(renderer.domElement)

    // Create light
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Create materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
    })

    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.7,
      roughness: 0.2,
    })

    // Create the scales of justice
    const baseGeometry = new THREE.BoxGeometry(1, 0.1, 0.5)
    const base = new THREE.Mesh(baseGeometry, goldMaterial)
    base.position.y = -1
    scene.add(base)

    // Create the vertical pole
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32)
    const pole = new THREE.Mesh(poleGeometry, goldMaterial)
    pole.position.y = 0
    base.add(pole)

    // Create the horizontal beam
    const beamGeometry = new THREE.BoxGeometry(3, 0.1, 0.1)
    const beam = new THREE.Mesh(beamGeometry, goldMaterial)
    beam.position.y = 1
    pole.add(beam)

    // Create the left scale pan
    const panGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32)
    const leftPan = new THREE.Mesh(panGeometry, blackMaterial)
    leftPan.position.set(-1.2, -0.5, 0)
    beam.add(leftPan)

    // Create the right scale pan
    const rightPan = new THREE.Mesh(panGeometry, blackMaterial)
    rightPan.position.set(1.2, -0.3, 0)
    beam.add(rightPan)

    // Create strings connecting pans to the beam
    const leftStringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 8)
    const leftString = new THREE.Mesh(leftStringGeometry, blackMaterial)
    leftString.position.set(-1.2, 0.3, 0)
    beam.add(leftString)

    const rightStringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8)
    const rightString = new THREE.Mesh(rightStringGeometry, blackMaterial)
    rightString.position.set(1.2, 0.4, 0)
    beam.add(rightString)

    // Create a book for the right pan
    const bookGeometry = new THREE.BoxGeometry(0.7, 0.1, 0.5)
    const book = new THREE.Mesh(bookGeometry, new THREE.MeshStandardMaterial({ color: 0x8844aa }))
    book.position.y = 0.1
    rightPan.add(book)

    // Create animation
    let animationFrame: number
    const animate = () => {
      animationFrame = requestAnimationFrame(animate)

      // Rotate the scales slightly to give a floating effect
      const time = Date.now() * 0.001
      beam.rotation.z = Math.sin(time) * 0.1
      leftPan.position.y = -0.5 - Math.sin(time) * 0.1
      rightPan.position.y = -0.3 + Math.sin(time) * 0.1

      // Rotate the entire scene slightly based on mouse movement or time
      scene.rotation.y = Math.sin(time * 0.3) * 0.2

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrame)
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full"></div>
}
