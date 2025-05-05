"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsFiltersProps {
  onCategoryChange: (category: string) => void
  onSearch: (query: string) => void
  selectedCategory: string
}

export function NewsFilters({ onCategoryChange, onSearch, selectedCategory }: NewsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select defaultValue={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="domestic">Domestic</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="top">Top Stories</SelectItem>
              <SelectItem value="world">World</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search legal news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
