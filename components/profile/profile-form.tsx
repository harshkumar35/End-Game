"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save, User, Phone, MapPin, Briefcase, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    languages: lawyerProfile?.languages || "",
    education: lawyerProfile?.education || "",
    certifications: lawyerProfile?.certifications || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvailabilityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      isAvailable: value === "true",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Updating profile with data:", formData)

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

      if (userError) {
        console.error("User update error:", userError)
        throw userError
      }

      console.log("User data updated successfully")

      // Update lawyer profile if applicable
      if (user.role === "lawyer") {
        const lawyerData = {
          bio: formData.bio,
          specialization: formData.specialization,
          experience: Number.parseInt(formData.experience) || 0,
          hourly_rate: Number.parseFloat(formData.hourlyRate) || 0,
          is_available: formData.isAvailable,
          languages: formData.languages,
          education: formData.education,
          certifications: formData.certifications,
          updated_at: new Date().toISOString(),
        }

        console.log("Updating lawyer profile with:", lawyerData)

        // Check if lawyer profile exists
        const { data: existingProfile } = await supabase
          .from("lawyer_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (existingProfile) {
          // Update existing profile
          const { error: profileError } = await supabase
            .from("lawyer_profiles")
            .update(lawyerData)
            .eq("user_id", user.id)

          if (profileError) {
            console.error("Lawyer profile update error:", profileError)
            throw profileError
          }
        } else {
          // Create new profile
          const { error: profileError } = await supabase.from("lawyer_profiles").insert({
            user_id: user.id,
            ...lawyerData,
          })

          if (profileError) {
            console.error("Lawyer profile create error:", profileError)
            throw profileError
          }
        }

        console.log("Lawyer profile updated successfully")
      }

      toast({
        title: "✅ Profile Updated Successfully!",
        description: "Your profile information has been saved.",
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "❌ Error Updating Profile",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Lawyer-specific fields */}
            {user?.role === "lawyer" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Write a brief description about your professional background, expertise, and approach..."
                      rows={4}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Specialization *
                      </Label>
                      <Select
                        value={formData.specialization}
                        onValueChange={(value) => handleSelectChange("specialization", value)}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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
                      <Label htmlFor="experience" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.experience}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Hourly Rate (₹)
                      </Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        step="100"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="5000"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        placeholder="English, Hindi, Marathi"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Availability Status</Label>
                      <Select value={formData.isAvailable.toString()} onValueChange={handleAvailabilityChange}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">✅ Available for new cases</SelectItem>
                          <SelectItem value="false">❌ Not currently taking cases</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="LLB from XYZ University (2015), LLM in Corporate Law (2017)"
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications & Bar Admissions</Label>
                    <Textarea
                      id="certifications"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      placeholder="Bar Council of India (2015), Certified Mediator (2018)"
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
