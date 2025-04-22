"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface ExperienceSectionProps {
  userId: string
}

interface Experience {
  id: string
  user_id: string
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  created_at: string
}

export function ExperienceSection({ userId }: ExperienceSectionProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  })

  // Fetch experiences on component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .eq("user_id", userId)
          .order("start_date", { ascending: false })

        if (error) throw error

        setExperiences(data || [])
      } catch (error) {
        console.error("Error fetching experiences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()

    // Set up real-time subscription
    const channel = supabase
      .channel("experiences-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "experiences",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setExperiences((prev) => [payload.new as Experience, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setExperiences((prev) => prev.map((exp) => (exp.id === payload.new.id ? (payload.new as Experience) : exp)))
          } else if (payload.eventType === "DELETE") {
            setExperiences((prev) => prev.filter((exp) => exp.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    })
    setEditingExperience(null)
  }

  const handleOpenDialog = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        title: experience.title,
        company: experience.company,
        location: experience.location || "",
        startDate: experience.start_date.split("T")[0], // Format date for input
        endDate: experience.end_date ? experience.end_date.split("T")[0] : "",
        isCurrent: experience.is_current,
        description: experience.description || "",
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isCurrent: e.target.checked,
      endDate: e.target.checked ? "" : formData.endDate,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const experienceData = {
        user_id: userId,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        start_date: formData.startDate,
        end_date: formData.isCurrent ? null : formData.endDate || null,
        is_current: formData.isCurrent,
        description: formData.description,
      }

      if (editingExperience) {
        // Update existing experience
        const { error } = await supabase.from("experiences").update(experienceData).eq("id", editingExperience.id)

        if (error) throw error

        toast({
          title: "Experience updated",
          description: "Your experience has been updated successfully.",
        })
      } else {
        // Create new experience
        const { error } = await supabase.from("experiences").insert(experienceData)

        if (error) throw error

        toast({
          title: "Experience added",
          description: "Your experience has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error("Error saving experience:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save experience. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Experience deleted",
        description: "Your experience has been deleted successfully.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error deleting experience:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return format(new Date(dateString), "MMM yyyy")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Experience</h2>
          <p className="text-muted-foreground">Add your professional experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
                <DialogDescription>
                  {editingExperience
                    ? "Update your professional experience details"
                    : "Add details about your professional experience"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Corporate Lawyer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g., Smith & Associates"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={formData.isCurrent}
                      required={!formData.isCurrent}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isCurrent" className="text-sm font-medium">
                    I currently work here
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gradient-bg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{experience.title}</CardTitle>
                    <CardDescription>
                      {experience.company} • {experience.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(experience)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(experience.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {formatDate(experience.start_date)} -{" "}
                  {experience.is_current ? "Present" : formatDate(experience.end_date)}
                </div>
                <p className="text-sm">{experience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't added any experience yet.</p>
            <Button onClick={() => handleOpenDialog()} className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
