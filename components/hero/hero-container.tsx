import Image from "next/image"

export function HeroContainer() {
  return (
    <div className="flex justify-center items-center h-[400px] lg:h-[500px]">
      <Image
        src="/placeholder.svg?height=400&width=500"
        alt="Legal Services"
        width={500}
        height={400}
        className="object-contain"
        priority
      />
    </div>
  )
}
