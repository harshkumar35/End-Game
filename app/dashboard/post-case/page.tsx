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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const caseTypes = [
  { value: "family", label: "Family Law" },
  { value: "criminal", label: "Criminal Defense" },
  { value: "corporate", label: "Corporate Law" },
  { value: "property", label: "Property Law" },
  { value: "immigration", label: "Immigration Law" },
  { value: "employment", label: "Employment Law" },
  { value: "intellectual_property", label: "Intellectual Property" },
  { value: "tax", label: "Tax Law" },
  { value: "personal_injury", label: "Personal Injury" },
  { value: "other", label: "Other" },
]

export default function PostCasePage() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    caseType: "",
    location: "",
    budget: "",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a case.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from("cases").insert({
        client_id: user.id,
        title: formData.title,
        description: formData.description,
        case_type: formData.caseType,
        location: formData.location,
        budget: Number.parseFloat(formData.budget) || 0,
        status: "open",
      })

      if (error) throw error

      toast({
        title: "Case posted successfully!",
        description: "Lawyers will now be able to see your case and send proposals.",
      })

      router.push("/dashboard/my-cases")
    } catch (error: any) {
      toast({
        title: "Failed to post case",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post a New Case</h1>
        <p className="text-muted-foreground">Provide details about your legal issue to find the right lawyer</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
            <CardDescription>Fill out the form below with information about your legal needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Case Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., Need help with divorce proceedings"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Case Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your legal issue in detail..."
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="caseType">Case Type</Label>
                <Select value={formData.caseType} onValueChange={(value) => handleSelectChange("caseType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="E.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="E.g., 1000"
                value={formData.budget}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Enter your estimated budget for this case. Leave blank if you're not sure.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Case"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
