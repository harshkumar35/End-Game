import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CreatePostForm from "@/components/posts/create-post-form"

export const dynamic = "force-dynamic"

export default async function CreatePostPage() {
  const supabase = createServerSupabaseClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/dashboard/create-post")
  }

  // Get user role
  const { data: userData, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

  if (error) {
    console.error("Error fetching user data:", error)
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">Share your thoughts, questions, or insights with the community</p>
      </div>

      <CreatePostForm userRole={userData.role} />
    </div>
  )
}
