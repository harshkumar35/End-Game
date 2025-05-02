"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SpecializationFilterProps {
  searchParams: {
    specialization?: string
    search?: string
  }
  uniqueSpecializations: string[]
}

export function SpecializationFilter({ searchParams, uniqueSpecializations }: SpecializationFilterProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(searchParams.search || "")
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchValue) {
      params.set("search", searchValue)
    }

    if (searchParams.specialization) {
      params.set("specialization", searchParams.specialization)
    }

    startTransition(() => {
      router.push(`/lawyers?${params.toString()}`)
    })
  }

  const handleSpecializationChange = (specialization: string) => {
    const params = new URLSearchParams()

    if (searchParams.search) {
      params.set("search", searchParams.search)
    }

    if (specialization !== "all") {
      params.set("specialization", specialization)
    }

    startTransition(() => {
      router.push(`/lawyers?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Input
          type="text"
          placeholder="Search lawyers..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="sm" className="absolute right-1 top-1 h-7" disabled={isPending}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={!searchParams.specialization ? "default" : "outline"}
          size="sm"
          onClick={() => handleSpecializationChange("all")}
          disabled={isPending}
        >
          All
        </Button>

        {uniqueSpecializations.map((specialization) => (
          <Button
            key={specialization}
            variant={searchParams.specialization === specialization ? "default" : "outline"}
            size="sm"
            onClick={() => handleSpecializationChange(specialization)}
            disabled={isPending}
          >
            {specialization}
          </Button>
        ))}
      </div>

      {(searchParams.search || searchParams.specialization) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            startTransition(() => {
              router.push("/lawyers")
            })
          }}
          disabled={isPending}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
