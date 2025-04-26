"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Share } from "lucide-react"
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
  const [isLiking, setIsLiking] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLike = async () => {
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      router.push(`/login?redirect=/posts/${postId}`)
      return
    }

    setIsLiking(true)

    try {
      if (hasLiked) {
        // Unlike the post
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.session.user.id)

        if (error) throw error

        // Update post likes count
        await supabase.rpc("decrement_post_likes", { post_id: postId })

        setLikes((prev) => prev - 1)
        setHasLiked(false)
      } else {
        // Like the post
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: session.session.user.id,
        })

        if (error) throw error

        // Update post likes count
        await supabase.rpc("increment_post_likes", { post_id: postId })

        setLikes((prev) => prev + 1)
        setHasLiked(true)
      }

      router.refresh()
    } catch (error: any) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post on LegalSathi",
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      })
    }
  }

  return (
    <div className="flex items-center gap-6">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${hasLiked ? "text-blue-600" : ""}`}
        onClick={handleLike}
        disabled={isLiking}
      >
        <ThumbsUp className={`h-5 w-5 ${hasLiked ? "fill-blue-600" : ""}`} />
        <span>{likes} likes</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
        <a href="#comments">
          <MessageSquare className="h-5 w-5" />
          <span>{initialComments} comments</span>
        </a>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
        <Share className="h-5 w-5" />
        <span>Share</span>
      </Button>
    </div>
  )
}
