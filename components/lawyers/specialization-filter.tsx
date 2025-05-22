"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface SpecializationFilterProps {
  searchParams: { specialization?: string; search?: string }
  uniqueSpecializations: string[]
}

export function SpecializationFilter({ searchParams, uniqueSpecializations }: SpecializationFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(searchParams.search || "")

  // Set initial search value from URL
  useEffect(() => {
    setSearch(searchParams.search || "")
  }, [searchParams.search])

  // Handle specialization filter change
  const handleSpecializationChange = (specialization: string) => {
    const params = new URLSearchParams()

    if (specialization !== "all") {
      params.set("specialization", specialization)
    }

    if (search) {
      params.set("search", search)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (searchParams.specialization && searchParams.specialization !== "all") {
      params.set("specialization", searchParams.specialization)
    }

    if (search) {
      params.set("search", search)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!searchParams.specialization || searchParams.specialization === "all" ? "default" : "outline"}
          onClick={() => handleSpecializationChange("all")}
          className="text-sm"
        >
          All Specializations
        </Button>

        {uniqueSpecializations.map((specialization) => (
          <Button
            key={specialization}
            variant={searchParams.specialization === specialization ? "default" : "outline"}
            onClick={() => handleSpecializationChange(specialization)}
            className="text-sm"
          >
            {specialization}
          </Button>
        ))}
      </div>
    </div>
  )
}
