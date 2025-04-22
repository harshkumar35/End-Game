"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Text3D } from "@react-three/drei"
import { useSpring, animated } from "@react-spring/three"
import type * as THREE from "three"

function Model({ scale = 1, position = [0, 0, 0] }) {
  const ref = useRef<THREE.Group>(null)

  // Use a simple cube mesh instead of loading a model
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  )
}

function FloatingText() {
  const [springs, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 2, tension: 50, friction: 15 },
  }))

  useFrame((state) => {
    api.start({
      position: [0, Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2, 0],
    })
  })

  return (
    <animated.group position={springs.position as any}>
      <Text3D font="/fonts/Inter_Bold.json" size={0.5} height={0.1} curveSegments={12} position={[-2, 0, 0]}>
        LegalSathi
        <meshStandardMaterial color="#0ea5e9" />
      </Text3D>
    </animated.group>
  )
}

function ScaleModel() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2
    }
  })

  return (
    <mesh ref={ref} position={[2, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <div className="w-full h-[400px]">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />

        <Model scale={1} position={[-2, -1, 0]} />
        <ScaleModel />
        <FloatingText />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
