"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: any
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
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
              <h3 className="text-lg font-semibold">{post.title}</h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{post.content}</p>

        {post.image_url && (
          <div className="mt-4 relative h-48 rounded-md overflow-hidden">
            <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
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
  )
}
