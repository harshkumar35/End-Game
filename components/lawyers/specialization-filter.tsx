"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface SpecializationFilterProps {
  searchParams: { specialization?: string; search?: string }
  uniqueSpecializations: string[]
}

export function SpecializationFilter({ searchParams, uniqueSpecializations }: SpecializationFilterProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(params.toString())
    if (searchTerm) {
      newParams.set("search", searchTerm)
    } else {
      newParams.delete("search")
    }
    router.push(`/lawyers?${newParams.toString()}`)
  }

  const handleSpecializationChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString())
    if (value && value !== "all") {
      newParams.set("specialization", value)
    } else {
      newParams.delete("specialization")
    }
    router.push(`/lawyers?${newParams.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/lawyers")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search lawyers by name, specialization, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="default">
          Search
        </Button>
      </form>

      {/* Specialization Filter */}
      <div className="flex gap-2 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={searchParams.specialization || "all"} onValueChange={handleSpecializationChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Specializations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {uniqueSpecializations.map((specialization) => (
              <SelectItem key={specialization} value={specialization}>
                {specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {(searchParams.search || searchParams.specialization) && (
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
