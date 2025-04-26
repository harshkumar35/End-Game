import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const content = formData.get("content") as string

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Add comment to database
    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: params.id,
        user_id: session.user.id,
        content: content.trim(),
      })
      .select()

    if (error) {
      console.error("Error adding comment:", error)
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }

    // Redirect back to post page
    return NextResponse.redirect(new URL(`/posts/${params.id}#comments`, request.url), { status: 303 })
  } catch (error) {
    console.error("Error processing comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
