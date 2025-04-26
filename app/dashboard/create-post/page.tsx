"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, X, ImageIcon } from "lucide-react"
import { uploadPostImage } from "@/lib/utils/upload-image"

export default function CreatePostPage() {
  const router = useRouter()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tagInput: "",
    imageUrl: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a URL for preview
    const url = URL.createObjectURL(file)
    setSelectedImage(file)
    setPreviewUrl(url)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
        .select("role")
        .eq("id", user.id)
        .single()

      if (userError) throw userError

      let imageUrl = ""

      // Upload image if selected
      if (selectedImage) {
        imageUrl = (await uploadPostImage(selectedImage, user.id)) || ""
      }

      // Create post
      const { error: postError } = await supabase.from("posts").insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        role: userData.role,
        tags: tags,
        image_url: imageUrl,
      })

      if (postError) throw postError

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      })

      router.push("/dashboard")
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

  // If user is not authenticated, redirect to login
  if (!authLoading && !user) {
    router.push("/login?redirect=/dashboard/create-post")
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">Share your legal insights, experiences, or questions with the community</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>Share valuable information with clients and other lawyers</CardDescription>
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
              <Label htmlFor="image">Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  {selectedImage ? "Change Image" : "Add Image"}
                </Button>
                {previewUrl && (
                  <Button type="button" variant="ghost" onClick={removeImage} className="text-destructive">
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {previewUrl && (
                <div className="mt-2 relative">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-64 max-w-full object-contain rounded-md border"
                  />
                </div>
              )}
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
            <Button type="submit" className="gradient-bg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
