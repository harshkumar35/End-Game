"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Calendar, User, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ApplicationCardProps {
  application: {
    id: string
    case_id: string
    message: string | null
    status: string
    created_at: string
    case: {
      title: string
      description: string
      client: {
        email: string
        full_name: string
      }
    }
  }
  onStatusChange?: (id: string, newStatus: string) => void
  isClient?: boolean
}

export default function ApplicationCard({ application, onStatusChange, isClient = false }: ApplicationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleStatusChange = async (newStatus: string) => {
    if (!onStatusChange) return

    setIsUpdating(true)
    try {
      const { error } = await supabase.from("case_applications").update({ status: newStatus }).eq("id", application.id)

      if (error) throw error

      onStatusChange(application.id, newStatus)

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`,
      })
    } catch (error: any) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{application.case.title}</CardTitle>
          {getStatusBadge(application.status)}
        </div>
        <p className="text-sm text-muted-foreground">
          Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Case Description</h4>
            <p className="text-sm text-muted-foreground">{application.case.description}</p>
          </div>

          {application.message && (
            <div>
              <h4 className="text-sm font-medium mb-1">Application Message</h4>
              <p className="text-sm text-muted-foreground">{application.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Client: {application.case.client.full_name}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/cases/${application.case_id}`)}>
          View Case
        </Button>

        {isClient && application.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-50"
              onClick={() => handleStatusChange("accepted")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleStatusChange("rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
            </Button>
          </div>
        )}

        {application.status === "accepted" && (
          <Button size="sm" className="gradient-bg">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
