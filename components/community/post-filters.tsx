"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface PostFiltersProps {
  onFilterChange: (filters: { role: string; tag: string; sort: string }) => void
}

export function PostFilters({ onFilterChange }: PostFiltersProps) {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [tag, setTag] = useState("")
  const [sort, setSort] = useState("recent")
  const [availableTags] = useState([
    "legal-advice",
    "case-study",
    "question",
    "discussion",
    "news",
    "opinion",
    "resources",
    "career",
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Apply filters
    onFilterChange({ role, tag, sort })
  }

  const handleClearFilters = () => {
    setSearch("")
    setRole("")
    setTag("")
    setSort("recent")
    onFilterChange({ role: "", tag: "", sort: "recent" })
  }

  const hasActiveFilters = role || tag || sort !== "recent"

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8"
            />
            <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="lawyer">Lawyers</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger id="tag">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {availableTags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Most recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="likes">Most liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      <div className="flex justify-between items-center">
        <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
          Apply Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
