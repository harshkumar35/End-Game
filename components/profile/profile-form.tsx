"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  user: any
  lawyerProfile: any
}

export function ProfileForm({ user, lawyerProfile }: ProfileFormProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: lawyerProfile?.bio || "",
    specialization: lawyerProfile?.specialization || "",
    experience: lawyerProfile?.experience?.toString() || "0",
    hourlyRate: lawyerProfile?.hourly_rate?.toString() || "0",
    isAvailable: lawyerProfile?.is_available === undefined ? true : lawyerProfile.is_available,
  })

  // Set up real-time subscription for user updates
  useEffect(() => {
    const userChannel = supabase
      .channel("user-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("User profile updated:", payload)
          // Update local state with new data
          setFormData((prev) => ({
            ...prev,
            fullName: payload.new.full_name || prev.fullName,
            email: payload.new.email || prev.email,
            phone: payload.new.phone || prev.phone,
            location: payload.new.location || prev.location,
          }))

          toast({
            title: "Profile Updated",
            description: "Your profile information has been updated.",
          })

          // Refresh the page to show updated data
          router.refresh()
        },
      )
      .subscribe()

    // If lawyer, also subscribe to lawyer_profiles changes
    let lawyerChannel: any = null
    if (user?.role === "lawyer") {
      lawyerChannel = supabase
        .channel("lawyer-profile-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "lawyer_profiles",
            filter: `user_id=eq.${user?.id}`,
          },
          (payload) => {
            console.log("Lawyer profile updated:", payload)
            // Update local state with new data
            setFormData((prev) => ({
              ...prev,
              bio: payload.new.bio || prev.bio,
              specialization: payload.new.specialization || prev.specialization,
              experience: payload.new.experience?.toString() || prev.experience,
              hourlyRate: payload.new.hourly_rate?.toString() || prev.hourlyRate,
              isAvailable: payload.new.is_available === undefined ? prev.isAvailable : payload.new.is_available,
            }))

            toast({
              title: "Lawyer Profile Updated",
              description: "Your lawyer profile information has been updated.",
            })

            // Refresh the page to show updated data
            router.refresh()
          },
        )
        .subscribe()
    }

    return () => {
      supabase.removeChannel(userChannel)
      if (lawyerChannel) supabase.removeChannel(lawyerChannel)
    }
  }, [supabase, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAvailabilityChange = (value: boolean) => {
    setFormData({
      ...formData,
      isAvailable: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user data
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (userError) throw userError

      // Update lawyer profile if applicable
      if (user.role === "lawyer") {
        const { error: profileError } = await supabase
          .from("lawyer_profiles")
          .update({
            bio: formData.bio,
            specialization: formData.specialization,
            experience: Number.parseInt(formData.experience) || 0,
            hourly_rate: Number.parseFloat(formData.hourlyRate) || 0,
            is_available: formData.isAvailable,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (profileError) throw profileError
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-muted-foreground">Update your personal information and profile details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={formData.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York, NY"
          />
        </div>
      </div>

      {user?.role === "lawyer" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a brief description about your professional background, expertise, and approach..."
              rows={5}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => handleSelectChange("specialization", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family Law</SelectItem>
                  <SelectItem value="criminal">Criminal Defense</SelectItem>
                  <SelectItem value="corporate">Corporate Law</SelectItem>
                  <SelectItem value="property">Property Law</SelectItem>
                  <SelectItem value="immigration">Immigration Law</SelectItem>
                  <SelectItem value="employment">Employment Law</SelectItem>
                  <SelectItem value="intellectual_property">Intellectual Property</SelectItem>
                  <SelectItem value="tax">Tax Law</SelectItem>
                  <SelectItem value="personal_injury">Personal Injury</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Availability Status</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="available"
                  name="availability"
                  className="mr-2"
                  checked={formData.isAvailable === true}
                  onChange={() => handleAvailabilityChange(true)}
                />
                <Label htmlFor="available" className="cursor-pointer">
                  Available for new cases
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="unavailable"
                  name="availability"
                  className="mr-2"
                  checked={formData.isAvailable === false}
                  onChange={() => handleAvailabilityChange(false)}
                />
                <Label htmlFor="unavailable" className="cursor-pointer">
                  Not currently taking cases
                </Label>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
