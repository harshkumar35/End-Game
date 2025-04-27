"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface LawyerSearchProps {
  searchParams: {
    specialization?: string
    search?: string
  }
  specializations: string[]
}

export default function LawyerSearch({ searchParams, specializations }: LawyerSearchProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.search || "")
  const [specialization, setSpecialization] = useState(searchParams.specialization || "all")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (specialization && specialization !== "all") params.set("specialization", specialization)

    router.push(`/lawyers?${params.toString()}`)
  }

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpecialization = e.target.value
    setSpecialization(newSpecialization)
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (specialization && specialization !== "all") params.set("specialization", specialization)

    router.push(`/lawyers?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-1/3 space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search</span>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            name="search"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
            Search
          </Button>
        </form>
      </div>

      <div className="w-full md:w-1/3 space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Specialization</span>
        </div>
        <div className="flex gap-2">
          <select
            name="specialization"
            value={specialization}
            onChange={handleSpecializationChange}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </option>
            ))}
          </select>
          <Button onClick={handleApplyFilters}>Apply</Button>
        </div>
      </div>
    </div>
  )
}
