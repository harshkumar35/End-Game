"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface SpecializationFilterProps {
  searchParams: { specialization?: string; search?: string }
  uniqueSpecializations: string[]
}

export function SpecializationFilter({ searchParams, uniqueSpecializations }: SpecializationFilterProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(currentSearchParams.toString())

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }

    router.push(`/lawyers?${params.toString()}`)
  }

  const handleSpecializationFilter = (specialization: string) => {
    const params = new URLSearchParams(currentSearchParams.toString())

    if (specialization === "all") {
      params.delete("specialization")
    } else {
      params.set("specialization", specialization)
    }

    router.push(`/lawyers?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/lawyers")
  }

  const hasActiveFilters = searchParams.search || searchParams.specialization

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lawyers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Search
        </Button>
        {hasActiveFilters && (
          <Button type="button" variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </form>

      {/* Specialization Filters */}
      {uniqueSpecializations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Filter by Specialization:</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!searchParams.specialization || searchParams.specialization === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => handleSpecializationFilter("all")}
            >
              All Specializations
            </Badge>
            {uniqueSpecializations.map((specialization) => (
              <Badge
                key={specialization}
                variant={searchParams.specialization === specialization ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleSpecializationFilter(specialization)}
              >
                {specialization}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {searchParams.search && <Badge variant="secondary">Search: "{searchParams.search}"</Badge>}
          {searchParams.specialization && searchParams.specialization !== "all" && (
            <Badge variant="secondary">Specialization: {searchParams.specialization}</Badge>
          )}
        </div>
      )}
    </div>
  )
}
