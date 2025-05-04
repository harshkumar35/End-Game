"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the HeroScene component with no SSR
const DynamicHeroScene = dynamic(() => import("@/components/3d/hero-scene"), { ssr: false })

export function HeroContainer() {
  return (
    <div className="h-[400px] lg:h-[500px]">
      <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>}>
        <DynamicHeroScene />
      </Suspense>
    </div>
  )
}
