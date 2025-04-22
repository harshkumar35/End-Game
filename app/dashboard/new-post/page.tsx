import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NewPostForm } from "@/components/community/new-post-form"

export default async function NewPostPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/dashboard/new-post")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">Share your legal insights, experiences, or questions with the community</p>
      </div>

      <NewPostForm />
    </div>
  )
}
