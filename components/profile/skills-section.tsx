"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X } from "lucide-react"

interface SkillsSectionProps {
  userId: string
}

interface Skill {
  id: string
  user_id: string
  name: string
  created_at: string
}

export function SkillsSection({ userId }: SkillsSectionProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true })

        if (error) throw error

        setSkills(data || [])
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()

    // Set up real-time subscription
    const channel = supabase
      .channel("skills-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "skills",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSkills((prev) => [...prev, payload.new as Skill])
          } else if (payload.eventType === "DELETE") {
            setSkills((prev) => prev.filter((skill) => skill.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    setIsSubmitting(true)

    try {
      // Check if skill already exists
      if (skills.some((skill) => skill.name.toLowerCase() === newSkill.trim().toLowerCase())) {
        toast({
          title: "Skill already exists",
          description: "You've already added this skill to your profile.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("skills").insert({
        user_id: userId,
        name: newSkill.trim(),
      })

      if (error) throw error

      setNewSkill("")
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      })
    } catch (error: any) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Skill removed",
        description: "Your skill has been removed successfully.",
      })
    } catch (error: any) {
      console.error("Error removing skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-muted-foreground">Add your professional skills and expertise</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
            <Input
              placeholder="Add a skill (e.g., Contract Law, Negotiation, etc.)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting || !newSkill.trim()} className="gradient-bg">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">Add</span>
            </Button>
          </form>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm">
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't added any skills yet.</p>
              <p className="text-sm">Add skills to showcase your expertise to potential clients.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
