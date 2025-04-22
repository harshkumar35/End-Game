import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/community/post-card"
import { PostFilters } from "@/components/community/post-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { role?: string; tag?: string; sort?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Get auth session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Build query
  let query = supabase.from("posts").select(`
      *,
      user:user_id (
        id,
        full_name,
        email
      )
    `)

  // Apply role filter
  if (searchParams.role) {
    query = query.eq("role", searchParams.role)
  }

  // Apply tag filter
  if (searchParams.tag) {
    query = query.contains("tags", [searchParams.tag])
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

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Community</h1>
          <p className="text-muted-foreground">
            Join the conversation with lawyers and clients sharing legal insights and experiences
          </p>
        </div>
        {session && (
          <Button asChild className="gradient-bg">
            <Link href="/dashboard/new-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-8">
        <PostFilters
          onFilterChange={(filters) => {
            // This is handled by the server component via searchParams
            const url = new URL(window.location.href)
            if (filters.role) url.searchParams.set("role", filters.role)
            else url.searchParams.delete("role")

            if (filters.tag) url.searchParams.set("tag", filters.tag)
            else url.searchParams.delete("tag")

            if (filters.sort) url.searchParams.set("sort", filters.sort)
            else url.searchParams.delete("sort")

            window.history.pushState({}, "", url.toString())
            window.location.href = url.toString()
          }}
        />
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchParams.role || searchParams.tag
              ? "Try changing your filters or be the first to post in this category!"
              : "Be the first to share your thoughts with the community!"}
          </p>
          {session && (
            <Button asChild className="gradient-bg">
              <Link href="/dashboard/new-post">Create the first post</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
