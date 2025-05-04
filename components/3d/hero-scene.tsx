"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Text3D, Float, Sparkles, OrbitControls } from "@react-three/drei"
import { useSpring, animated } from "@react-spring/three"
import type * as THREE from "three"

function Model({ scale = 1, position = [0, 0, 0] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={ref} position={position} scale={scale}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>
    </Float>
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
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          position={[-2, 0, 0]}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          bevelSegments={5}
        >
          LegalSathi
          <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
        </Text3D>
      </Float>
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
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref} position={[2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  )
}

// Change to default export
const HeroScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />

        <Model scale={1} position={[-2, -1, 0]} />
        <ScaleModel />
        <FloatingText />

        <Sparkles count={100} scale={10} size={1} speed={0.3} color="#0ea5e9" />

        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

// Export both as default and named export to ensure compatibility
export default HeroScene
