"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PostActionButtonsProps {
  postId: string
  initialLikes: number
  initialComments: number
  userHasLiked: boolean
}

export default function PostActionButtons({
  postId,
  initialLikes,
  initialComments,
  userHasLiked,
}: PostActionButtonsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(userHasLiked)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleLike = async () => {
    try {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
          variant: "destructive",
        })
        return
      }

      if (hasLiked) {
        // Unlike post
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", session.user.id)

        // Update post likes count
        await supabase
          .from("posts")
          .update({ likes: likes - 1 })
          .eq("id", postId)

        setLikes(likes - 1)
        setHasLiked(false)
      } else {
        // Like post
        await supabase.from("post_likes").insert({ post_id: postId, user_id: session.user.id })

        // Update post likes count
        await supabase
          .from("posts")
          .update({ likes: likes + 1 })
          .eq("id", postId)

        setLikes(likes + 1)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to process your like. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      })
    } catch (error) {
      console.error("Error sharing post:", error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${hasLiked ? "text-red-500" : ""}`}
        onClick={handleLike}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </Button>

      <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
        <a href={`/posts/${postId}#comments`}>
          <MessageSquare className="h-4 w-4" />
          <span>{initialComments}</span>
        </a>
      </Button>

      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>
  )
}
