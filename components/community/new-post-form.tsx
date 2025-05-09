"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"

export function NewPostForm() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tagInput: "",
  })
  const [tags, setTags] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(formData.tagInput.trim())) {
        setTags([...tags, formData.tagInput.trim()])
      }
      setFormData({
        ...formData,
        tagInput: "",
      })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for your post",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get user role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", user.id)
        .single()

      if (userError) throw userError

      // Create post
      const { data: newPost, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          role: userData.role,
          tags: tags,
          author_name: userData.full_name, // Add author name for easier display
        })
        .select()

      if (postError) throw postError

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      })

      // Clear form
      setFormData({
        title: "",
        content: "",
        tagInput: "",
      })
      setTags([])

      // Navigate to community page
      router.push("/community")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Share your legal insights, experiences, or questions with the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share your thoughts, experiences, or questions..."
              rows={6}
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagInput">Tags (press Enter to add)</Label>
            <Input
              id="tagInput"
              name="tagInput"
              placeholder="Add tags like 'legal-advice', 'case-study', etc."
              value={formData.tagInput}
              onChange={handleChange}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </span>
            ) : (
              "Publish Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
