"use client"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { role?: string; search?: string; sort?: string }
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

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,content.ilike.%${searchParams.search}%`)
  }

  // Apply sorting
  if (searchParams.sort === "likes") {
    query = query.order("likes", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
  }

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Community Posts</h1>
        <p className="text-muted-foreground">Explore posts from lawyers and clients in our legal community</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
        <div className="w-full md:w-1/3 space-y-2">
          <form action="/posts" method="get" className="relative">
            <Input name="search" placeholder="Search posts..." defaultValue={searchParams.search || ""} />
            <input type="hidden" name="role" value={searchParams.role || ""} />
            <input type="hidden" name="sort" value={searchParams.sort || ""} />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <form action="/posts" method="get" className="flex gap-2">
            <input type="hidden" name="search" value={searchParams.search || ""} />
            <input type="hidden" name="sort" value={searchParams.sort || ""} />
            <select
              name="role"
              defaultValue={searchParams.role || "all"}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                e.target.form?.requestSubmit()
              }}
            >
              <option value="all">All Posts</option>
              <option value="lawyer">Lawyer Posts</option>
              <option value="client">Client Posts</option>
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <form action="/posts" method="get" className="flex gap-2">
            <input type="hidden" name="search" value={searchParams.search || ""} />
            <input type="hidden" name="role" value={searchParams.role || ""} />
            <select
              name="sort"
              defaultValue={searchParams.sort || "recent"}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                e.target.form?.requestSubmit()
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
            </select>
            <Button type="submit">Sort</Button>
          </form>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        {session ? (
          <Button asChild>
            <Link href="/dashboard/create-post">Create Post</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login?redirect=/dashboard/create-post">Login to Post</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.users?.avatar_url || "/placeholder.svg"} alt={post.users?.full_name || ""} />
                    <AvatarFallback>{post.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{post.users?.full_name}</span>
                      <span className="mx-1">•</span>
                      <Badge variant="outline" className="text-xs">
                        {post.users?.role === "lawyer" ? "Lawyer" : "Client"}
                      </Badge>
                      <span className="mx-1">•</span>
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
                {post.image_url && (
                  <div className="mt-4">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="rounded-md w-full h-48 object-cover"
                    />
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{post.likes || 0} likes</span>
                  <span className="mx-1">•</span>
                  <span>{post.comments_count || 0} comments</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/posts/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchParams.search || searchParams.role
                ? "Try changing your search criteria or filters"
                : "Be the first to create a post in our community!"}
            </p>
            <Button asChild variant="outline">
              <Link href="/posts">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
