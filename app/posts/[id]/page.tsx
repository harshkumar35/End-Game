import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import PostActionButtons from "@/components/posts/post-action-buttons"

export const dynamic = "force-dynamic"

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch post details
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      comments:post_comments (
        id,
        content,
        created_at,
        user:user_id (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !post) {
    console.error("Error fetching post:", error)
    notFound()
  }

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

  // Sort comments by created_at
  const sortedComments = post.comments.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return (
    <div className="container py-8">
      <Link href="/posts" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to all posts
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.user?.avatar_url || "/placeholder.svg"} alt={post.user?.full_name} />
              <AvatarFallback>{post.user?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-lg">{post.user?.full_name}</span>
                <Badge variant={post.role === "lawyer" ? "default" : "secondary"}>
                  {post.role === "lawyer" ? "Lawyer" : "Client"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          <div className="prose dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {post.image_url && (
            <div className="mt-6 relative h-96 rounded-md overflow-hidden">
              <Image src={post.image_url || "/placeholder.svg"} alt={post.title} fill className="object-contain" />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <PostActionButtons
              postId={post.id}
              initialLikes={post.likes || 0}
              initialComments={post.comments?.length || 0}
              userHasLiked={userHasLiked}
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-6" id="comments">
          <h2 className="text-xl font-bold mb-6">Comments ({post.comments?.length || 0})</h2>

          {session ? (
            <CommentForm postId={post.id} />
          ) : (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="mb-2">Sign in to leave a comment</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}

          {sortedComments.length > 0 ? (
            <div className="space-y-6 mt-8">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.avatar_url || "/placeholder.svg"} alt={comment.user?.full_name} />
                    <AvatarFallback>{comment.user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{comment.user?.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Comment form component
function CommentForm({ postId }: { postId: string }) {
  return (
    <form action={`/api/posts/${postId}/comments`} method="post" className="space-y-4">
      <div>
        <textarea
          name="content"
          rows={3}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
          required
        ></textarea>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Post Comment</Button>
      </div>
    </form>
  )
}
