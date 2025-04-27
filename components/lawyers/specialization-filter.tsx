"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

interface SpecializationFilterProps {
  searchParams: {
    specialization?: string
    search?: string
  }
  uniqueSpecializations: string[]
}

export function SpecializationFilter({ searchParams, uniqueSpecializations }: SpecializationFilterProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-auto md:flex-1">
        <form action="/lawyers" method="get" className="relative">
          <Input
            name="search"
            placeholder="Search lawyers..."
            defaultValue={searchParams.search || ""}
            className="w-full"
          />
          <input type="hidden" name="specialization" value={searchParams.specialization || ""} />
          <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="w-full md:w-auto">
        <form action="/lawyers" method="get">
          <input type="hidden" name="search" value={searchParams.search || ""} />
          <select
            name="specialization"
            defaultValue={searchParams.specialization || "all"}
            onChange={(e) => {
              e.target.form?.submit()
            }}
            className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Specializations</option>
            {uniqueSpecializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </form>
      </div>

      {(searchParams.search || searchParams.specialization) && (
        <Button variant="ghost" asChild>
          <a href="/lawyers">Clear Filters</a>
        </Button>
      )}
    </div>
  )
}
