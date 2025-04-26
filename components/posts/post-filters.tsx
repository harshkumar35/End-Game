"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface PostFiltersProps {
  searchParams: {
    role?: string
    tag?: string
    search?: string
    sort?: string
  }
  allTags: string[]
}

export default function PostFilters({ searchParams, allTags }: PostFiltersProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.search || "")
  const [role, setRole] = useState(searchParams.role || "all")
  const [tag, setTag] = useState(searchParams.tag || "")
  const [sort, setSort] = useState(searchParams.sort || "recent")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (role && role !== "all") params.set("role", role)
    if (tag) params.set("tag", tag)
    if (sort && sort !== "recent") params.set("sort", sort)

    router.push(`/posts?${params.toString()}`)
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (e.target.value && e.target.value !== "all") params.set("role", e.target.value)
    if (tag) params.set("tag", tag)
    if (sort && sort !== "recent") params.set("sort", sort)

    router.push(`/posts?${params.toString()}`)
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTag(e.target.value)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (role && role !== "all") params.set("role", role)
    if (e.target.value) params.set("tag", e.target.value)
    if (sort && sort !== "recent") params.set("sort", sort)

    router.push(`/posts?${params.toString()}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (role && role !== "all") params.set("role", role)
    if (tag) params.set("tag", tag)
    if (e.target.value && e.target.value !== "recent") params.set("sort", e.target.value)

    router.push(`/posts?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
      <div className="w-full md:w-auto md:flex-1">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            name="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="w-full md:w-auto">
          <select
            name="role"
            value={role}
            onChange={handleRoleChange}
            className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Roles</option>
            <option value="lawyer">Lawyers</option>
            <option value="client">Clients</option>
          </select>
        </div>

        {allTags.length > 0 && (
          <div className="w-full md:w-auto">
            <select
              name="tag"
              value={tag}
              onChange={handleTagChange}
              className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full md:w-auto">
          <select
            name="sort"
            value={sort}
            onChange={handleSortChange}
            className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="recent">Most Recent</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>

        {(searchParams.search || searchParams.role || searchParams.tag || searchParams.sort) && (
          <Button variant="ghost" asChild>
            <Link href="/posts">Clear Filters</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
