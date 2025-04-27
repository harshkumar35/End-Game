"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Remove any imports from next/headers
// import { cookies } from 'next/headers'; // Remove this line if it exists

export function NewsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [query, setQuery] = useState(searchParams.get("query") || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (query) params.set("query", query)

    router.push(`/legal-news?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <Input placeholder="Search news..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="politics">Politics</SelectItem>
          <SelectItem value="crime">Crime</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit">Search</Button>
    </form>
  )
}
