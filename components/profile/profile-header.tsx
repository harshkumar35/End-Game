"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, Pencil, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/lib/supabase/provider"
import { toast } from "@/components/ui/use-toast"
import { uploadProfileImage } from "@/lib/utils/upload-image"
import { useEffect } from "react"

interface ProfileHeaderProps {
  user: any
  lawyerProfile: any
}

export function ProfileHeader({ user, lawyerProfile }: ProfileHeaderProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || "")
  const [headline, setHeadline] = useState(lawyerProfile?.headline || "")
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const imageUrl = await uploadProfileImage(file, user.id)

      if (imageUrl) {
        // Update the user record with the new avatar URL
        const { error } = await supabase.from("users").update({ avatar_url: imageUrl }).eq("id", user.id)

        if (error) throw error

        setAvatarUrl(imageUrl)
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        })

        router.refresh()
      }
    } catch (error: any) {
      console.error("Error updating profile picture:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update user name
      const { error: userError } = await supabase.from("users").update({ full_name: fullName }).eq("id", user.id)

      if (userError) throw userError

      // Update lawyer headline if applicable
      if (user.role === "lawyer" && lawyerProfile) {
        const { error: profileError } = await supabase
          .from("lawyer_profiles")
          .update({ headline: headline })
          .eq("user_id", user.id)

        if (profileError) throw profileError
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })

      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none bg-muted/30">
      <CardContent className="p-6">
        <div className="relative">
          <div className="h-32 md:h-48 w-full rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 mb-16"></div>
          <div className="absolute left-6 -bottom-12">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user?.full_name || "User"} />
                <AvatarFallback className="text-2xl">{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
          <div className="absolute right-6 bottom-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading} className="gradient-bg">
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 ml-32 space-y-2">
          {isEditing ? (
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="max-w-md"
                />
              </div>
              {user?.role === "lawyer" && (
                <div>
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g., Corporate Lawyer with 10+ years of experience"
                    className="max-w-md"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{user?.full_name}</h1>
              {user?.role === "lawyer" && lawyerProfile?.headline && (
                <p className="text-muted-foreground">{lawyerProfile.headline}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {user?.role === "lawyer" ? "Lawyer" : "Client"} • {user?.email}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
