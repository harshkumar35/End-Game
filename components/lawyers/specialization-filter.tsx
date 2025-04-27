"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpecializationFilterProps {
  specializations: string[]
  currentSpecialization: string
}

export default function SpecializationFilter({ specializations, currentSpecialization }: SpecializationFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSpecializationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value !== "all") {
      params.set("specialization", value)
    } else {
      params.delete("specialization")
    }

    const search = params.toString()
    const query = search ? `?${search}` : ""
    router.push(`/lawyers${query}`)
  }

  return (
    <Select value={currentSpecialization || "all"} onValueChange={handleSpecializationChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Specializations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Specializations</SelectItem>
        {specializations.map((spec) => (
          <SelectItem key={spec} value={spec}>
            {spec.charAt(0).toUpperCase() + spec.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
