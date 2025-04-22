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

interface EducationSectionProps {
  userId: string
}

interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  created_at: string
}

export function EducationSection({ userId }: EducationSectionProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [educations, setEducations] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  })

  // Fetch educations on component mount
  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const { data, error } = await supabase
          .from("educations")
          .select("*")
          .eq("user_id", userId)
          .order("start_date", { ascending: false })

        if (error) throw error

        setEducations(data || [])
      } catch (error) {
        console.error("Error fetching educations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEducations()

    // Set up real-time subscription
    const channel = supabase
      .channel("educations-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "educations",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEducations((prev) => [payload.new as Education, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setEducations((prev) => prev.map((edu) => (edu.id === payload.new.id ? (payload.new as Education) : edu)))
          } else if (payload.eventType === "DELETE") {
            setEducations((prev) => prev.filter((edu) => edu.id !== payload.old.id))
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
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    })
    setEditingEducation(null)
  }

  const handleOpenDialog = (education?: Education) => {
    if (education) {
      setEditingEducation(education)
      setFormData({
        institution: education.institution,
        degree: education.degree,
        fieldOfStudy: education.field_of_study,
        startDate: education.start_date.split("T")[0], // Format date for input
        endDate: education.end_date ? education.end_date.split("T")[0] : "",
        isCurrent: education.is_current,
        description: education.description || "",
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
      const educationData = {
        user_id: userId,
        institution: formData.institution,
        degree: formData.degree,
        field_of_study: formData.fieldOfStudy,
        start_date: formData.startDate,
        end_date: formData.isCurrent ? null : formData.endDate || null,
        is_current: formData.isCurrent,
        description: formData.description,
      }

      if (editingEducation) {
        // Update existing education
        const { error } = await supabase.from("educations").update(educationData).eq("id", editingEducation.id)

        if (error) throw error

        toast({
          title: "Education updated",
          description: "Your education has been updated successfully.",
        })
      } else {
        // Create new education
        const { error } = await supabase.from("educations").insert(educationData)

        if (error) throw error

        toast({
          title: "Education added",
          description: "Your education has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error("Error saving education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return

    try {
      const { error } = await supabase.from("educations").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete education. Please try again.",
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
          <h2 className="text-2xl font-bold">Education</h2>
          <p className="text-muted-foreground">Add your educational background</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingEducation ? "Edit Education" : "Add Education"}</DialogTitle>
                <DialogDescription>
                  {editingEducation
                    ? "Update your educational background"
                    : "Add details about your educational background"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g., Harvard Law School"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g., Juris Doctor"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      placeholder="e.g., Law"
                      required
                    />
                  </div>
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
                    I am currently studying here
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your studies, achievements, activities..."
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
      ) : educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((education) => (
            <Card key={education.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{education.institution}</CardTitle>
                    <CardDescription>
                      {education.degree}, {education.field_of_study}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(education)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(education.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {formatDate(education.start_date)} -{" "}
                  {education.is_current ? "Present" : formatDate(education.end_date)}
                </div>
                <p className="text-sm">{education.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't added any education yet.</p>
            <Button onClick={() => handleOpenDialog()} className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
