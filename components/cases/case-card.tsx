"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CaseCardProps {
  caseData: {
    id: string
    title: string
    description: string
    status: string
    created_at: string
    client: {
      id: string
      email: string
    }
  }
  hasApplied: boolean
}

export default function CaseCard({ caseData, hasApplied }: CaseCardProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState("")
  const supabase = createClientComponentClient()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsApplying(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("applications").insert({
        case_id: caseData.id,
        lawyer_id: userData.user.id,
        message: applicationMessage,
        status: "pending",
      })

      if (error) {
        if (error.code === "23505") {
          throw new Error("You have already applied for this case")
        }
        throw error
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      })

      setShowApplicationForm(false)
      window.location.reload() // Refresh to update the hasApplied status
    } catch (error: any) {
      console.error("Error applying for case:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to apply for case. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{caseData.title}</CardTitle>
          <Badge variant={caseData.status === "open" ? "default" : "secondary"}>{caseData.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Posted {formatDistanceToNow(new Date(caseData.created_at), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{caseData.description}</p>

        {showApplicationForm && (
          <form onSubmit={handleApply} className="mt-4 space-y-4">
            <Textarea
              placeholder="Why are you a good fit for this case? (Optional)"
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isApplying}>
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter>
        {!hasApplied ? (
          !showApplicationForm && <Button onClick={() => setShowApplicationForm(true)}>Apply for this Case</Button>
        ) : (
          <Badge variant="outline" className="bg-green-50">
            You have applied for this case
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}
