"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { toast } from "@/components/ui/use-toast"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    role: string
    tags: string[]
    likes: number
    created_at: string
    user: {
      id: string
      full_name: string
      email: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const { supabase, user } = useSupabase()
  const [likes, setLikes] = useState(post.likes)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    setIsLiking(true)
    try {
      const { error } = await supabase
        .from("posts")
        .update({ likes: likes + 1 })
        .eq("id", post.id)

      if (error) throw error

      setLikes(likes + 1)
      toast({
        title: "Post liked",
        description: "You liked this post",
      })
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:border-primary/20 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt={post.user.full_name} />
            <AvatarFallback>{post.user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.user.full_name}</span>
              <Badge variant={post.role === "lawyer" ? "default" : "secondary"} className="text-xs">
                {post.role === "lawyer" ? "Lawyer" : "Client"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-muted-foreground">{post.content}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" asChild>
            <Link href={`/community/post/${post.id}`}>
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
