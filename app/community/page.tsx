"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PostCard } from "@/components/community/post-card"
import { PostFilters } from "@/components/community/post-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import type { Database } from "@/lib/types/database.types"

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    role: "",
    tag: "",
    sort: "recent",
  })

  const supabase = createClientComponentClient<Database>()

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // Fetch posts
      let query = supabase.from("posts").select(`
        *,
        user:user_id (
          id,
          full_name,
          email
        )
      `)

      // Apply role filter
      if (filters.role) {
        query = query.eq("role", filters.role)
      }

      // Apply tag filter
      if (filters.tag) {
        query = query.contains("tags", [filters.tag])
      }

      // Apply sorting
      if (filters.sort === "likes") {
        query = query.order("likes", { ascending: false })
      } else {
        // Default to most recent
        query = query.order("created_at", { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching posts:", error)
      } else {
        setPosts(data || [])
      }

      setIsLoading(false)
    }

    fetchData()

    // Set up real-time subscription for new posts
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          // Fetch the user data for the new post
          const fetchUserForPost = async () => {
            const { data: userData } = await supabase
              .from("users")
              .select("id, full_name, email")
              .eq("id", payload.new.user_id)
              .single()

            const newPost = {
              ...payload.new,
              user: userData,
            }

            // Add the new post to the state
            setPosts((currentPosts) => {
              // Check if we should add this post based on current filters
              if (filters.role && newPost.role !== filters.role) return currentPosts
              if (filters.tag && (!newPost.tags || !newPost.tags.includes(filters.tag))) return currentPosts

              // Add at the beginning if sorted by recent, otherwise just add
              if (filters.sort === "recent") {
                return [newPost, ...currentPosts]
              } else {
                return [...currentPosts, newPost]
              }
            })
          }

          fetchUserForPost()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Community</h1>
          <p className="text-muted-foreground">
            Join the conversation with lawyers and clients sharing legal insights and experiences
          </p>
        </div>
        {user && (
          <Button asChild className="bg-primary hover:bg-primary/90 w-full md:w-auto">
            <Link href="/dashboard/new-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-8">
        <PostFilters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {filters.role || filters.tag
              ? "Try changing your filters or be the first to post in this category!"
              : "Be the first to share your thoughts with the community!"}
          </p>
          {user && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/new-post">Create the first post</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
