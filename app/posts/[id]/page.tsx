import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft } from "lucide-react"
import PostActionButtons from "@/components/posts/post-action-buttons"
import PostComments from "@/components/posts/post-comments"

export const dynamic = "force-dynamic"

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch post with user details
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      users:user_id (
        id,
        full_name,
        avatar_url,
        role
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !post) {
    console.error("Error fetching post:", error)
    notFound()
  }

  // Fetch comments for this post
  const { data: comments } = await supabase
    .from("post_comments")
    .select(`
      *,
      users:user_id (
        id,
        full_name,
        avatar_url,
        role
      )
    `)
    .eq("post_id", params.id)
    .order("created_at", { ascending: true })

  // Check if user has liked this post
  let userHasLiked = false

  if (session) {
    const { data: likeData } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", session.user.id)
      .single()

    userHasLiked = !!likeData
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/posts" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.users?.avatar_url || "/placeholder.svg"} alt={post.users?.full_name || ""} />
              <AvatarFallback>{post.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{post.title}</h1>
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
        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.image_url && (
            <div className="mt-4">
              <img
                src={post.image_url || "/placeholder.svg"}
                alt={post.title}
                className="rounded-md w-full max-h-96 object-contain"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 pt-4 border-t">
            <PostActionButtons
              postId={post.id}
              initialLikes={post.likes || 0}
              initialComments={comments?.length || 0}
              userHasLiked={userHasLiked}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex-col items-start">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <PostComments postId={post.id} comments={comments || []} userId={session?.user.id} />
        </CardFooter>
      </Card>
    </div>
  )
}
