import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import PostFilters from "@/components/posts/post-filters"

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

        <PostFilters searchParams={searchParams} allTags={allTags} />
      </div>

      {posts?.length ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.users?.avatar_url || "/placeholder.svg"} alt={post.users?.full_name} />
                    <AvatarFallback>{post.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{post.users?.full_name}</span>
                      <Badge variant={post.role === "lawyer" ? "default" : "secondary"} className="text-xs">
                        {post.role === "lawyer" ? "Lawyer" : "Client"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{post.content}</p>

                {post.image_url && (
                  <div className="mt-4 relative h-48 rounded-md overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                  <Link href={`/posts/${post.id}`} className="text-sm font-medium hover:underline">
                    Read more
                  </Link>
                </div>
              </CardContent>
            </Card>
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
