"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  users: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
}

interface PostCommentsProps {
  postId: string
  comments: Comment[]
  userId?: string
}

export default function PostComments({ postId, comments, userId }: PostCommentsProps) {
  const [commentContent, setCommentContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on posts",
        variant: "destructive",
      })
      router.push(`/login?redirect=/posts/${postId}`)
      return
    }

    if (!commentContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        user_id: userId,
        content: commentContent.trim(),
      })

      if (error) throw error

      setCommentContent("")
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      })
      router.refresh()
    } catch (error: any) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {userId && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      )}

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.users?.avatar_url || "/placeholder.svg"} alt={comment.users?.full_name} />
                  <AvatarFallback>{comment.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.users?.full_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.users?.role === "lawyer" ? "Lawyer" : "Client"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!userId && (
        <div className="text-center border rounded-lg p-4">
          <p className="mb-2">Please log in to comment on this post</p>
          <Button asChild>
            <a href={`/login?redirect=/posts/${postId}`}>Log In</a>
          </Button>
        </div>
      )}
    </div>
  )
}
