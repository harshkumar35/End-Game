"use client"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/posts/post-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { role?: string; tag?: string; search?: string; sort?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Build query
  let query = supabase.from("posts").select(`
    *,
    users:user_id (
      id,
      full_name,
      avatar_url,
      role
    )
  `)

  // Apply role filter
  if (searchParams.role && searchParams.role !== "all") {
    query = query.eq("role", searchParams.role)
  }

  // Apply tag filter
  if (searchParams.tag && searchParams.tag !== "all") {
    query = query.contains("tags", [searchParams.tag])
  }

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,content.ilike.%${searchParams.search}%`)
  }

  // Apply sorting
  if (searchParams.sort === "likes") {
    query = query.order("likes", { ascending: false })
  } else {
    // Default to most recent
    query = query.order("created_at", { ascending: false })
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
  }

  // Get all unique tags from posts for filter
  const allTags: string[] = []
  posts?.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        if (!allTags.includes(tag)) {
          allTags.push(tag)
        }
      })
    }
  })

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">Insights, questions, and discussions from our legal community</p>
          </div>
          {session && (
            <Button asChild className="gradient-bg">
              <Link href="/dashboard/create-post">Create Post</Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
          <div className="w-full md:w-auto md:flex-1">
            <form action="/posts" method="get" className="relative">
              <Input
                name="search"
                placeholder="Search posts..."
                defaultValue={searchParams.search || ""}
                className="w-full"
              />
              <input type="hidden" name="role" value={searchParams.role || ""} />
              <input type="hidden" name="tag" value={searchParams.tag || ""} />
              <input type="hidden" name="sort" value={searchParams.sort || ""} />
              <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="w-full md:w-auto">
              <form action="/posts" method="get">
                <input type="hidden" name="search" value={searchParams.search || ""} />
                <input type="hidden" name="tag" value={searchParams.tag || ""} />
                <input type="hidden" name="sort" value={searchParams.sort || ""} />
                <select
                  name="role"
                  defaultValue={searchParams.role || "all"}
                  onChange={(e) => {
                    e.target.form?.submit()
                  }}
                  className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Roles</option>
                  <option value="lawyer">Lawyers</option>
                  <option value="client">Clients</option>
                </select>
              </form>
            </div>

            {allTags.length > 0 && (
              <div className="w-full md:w-auto">
                <form action="/posts" method="get">
                  <input type="hidden" name="search" value={searchParams.search || ""} />
                  <input type="hidden" name="role" value={searchParams.role || ""} />
                  <input type="hidden" name="sort" value={searchParams.sort || ""} />
                  <select
                    name="tag"
                    defaultValue={searchParams.tag || ""}
                    onChange={(e) => {
                      e.target.form?.submit()
                    }}
                    className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
            )}

            <div className="w-full md:w-auto">
              <form action="/posts" method="get">
                <input type="hidden" name="search" value={searchParams.search || ""} />
                <input type="hidden" name="role" value={searchParams.role || ""} />
                <input type="hidden" name="tag" value={searchParams.tag || ""} />
                <select
                  name="sort"
                  defaultValue={searchParams.sort || "recent"}
                  onChange={(e) => {
                    e.target.form?.submit()
                  }}
                  className="flex h-10 w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="recent">Most Recent</option>
                  <option value="likes">Most Liked</option>
                </select>
              </form>
            </div>

            {(searchParams.search || searchParams.role || searchParams.tag || searchParams.sort) && (
              <Button variant="ghost" asChild>
                <Link href="/posts">Clear Filters</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {posts?.length ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-1">
            {searchParams.search || searchParams.role !== "all" || searchParams.tag || searchParams.sort !== "recent"
              ? "Try adjusting your filters"
              : "Be the first to create a post!"}
          </p>
          {session && (
            <Button asChild className="mt-4 gradient-bg">
              <Link href="/dashboard/create-post">Create Post</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
