"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpecializationFilterProps {
  specializations: string[]
  currentSpecialization: string
  searchQuery: string
}

export default function SpecializationFilter({
  specializations,
  currentSpecialization,
  searchQuery,
}: SpecializationFilterProps) {
  const router = useRouter()

  const handleSpecializationChange = (value: string) => {
    const params = new URLSearchParams()

    if (value !== "all") {
      params.set("specialization", value)
    }

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    const queryString = params.toString()
    router.push(`/lawyers${queryString ? `?${queryString}` : ""}`)
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
