import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/community/post-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Link>
      </Button>

      <div className="mb-8">
        <PostCard post={post} />
      </div>

      <div className="p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <p className="text-muted-foreground text-center py-8">Comments feature coming soon!</p>
      </div>
    </div>
  )
}
