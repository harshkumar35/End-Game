"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Clock, FileText, ExternalLink } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyApplicationsPage() {
  const router = useRouter()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Fetch all applications with case details
        const { data, error } = await supabase
          .from("case_applications")
          .select(`
            *,
            case:case_id (
              *,
              client:client_id (
                full_name,
                email
              )
            )
          `)
          .eq("lawyer_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setApplications(data || [])
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [supabase, user])

  // If user is not authenticated, redirect
  if (!authLoading && !user) {
    router.push("/login?redirect=/dashboard/my-applications")
    return null
  }

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (e) {
      return dateString
    }
  }

  // Get status badge variant based on application status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get application status text with color
  const getApplicationStatus = (app: any) => {
    return (
      {
        accepted: "Accepted",
        rejected: "Rejected",
        pending: "Pending Review",
      }[app.status] || app.status
    )
  }

  // Filter applications by status
  const pendingApplications = applications.filter((app) => app.status === "pending")
  const acceptedApplications = applications.filter((app) => app.status === "accepted")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">Track your case applications and their status</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                formatDate={formatDate}
                getStatusBadgeVariant={getStatusBadgeVariant}
                getApplicationStatus={getApplicationStatus}
              />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingApplications.length > 0 ? (
              pendingApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getApplicationStatus={getApplicationStatus}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No pending applications</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You don't have any pending applications at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-6">
            {acceptedApplications.length > 0 ? (
              acceptedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getApplicationStatus={getApplicationStatus}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No accepted applications</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You don't have any accepted applications yet. Keep applying to cases!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedApplications.length > 0 ? (
              rejectedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getApplicationStatus={getApplicationStatus}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No rejected applications</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You don't have any rejected applications. Keep up the good work!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No applications yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              You haven't applied to any cases yet. Browse available cases to start.
            </p>
            <Button className="gradient-bg" onClick={() => router.push("/dashboard/cases")}>
              Browse Cases
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Application Card Component
function ApplicationCard({ application, formatDate, getStatusBadgeVariant, getApplicationStatus }: any) {
  return (
    <Card key={application.id} className="overflow-hidden hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{application.case.title}</CardTitle>
            <CardDescription>
              <Badge variant="outline" className="mr-2">
                {application.case.case_type || "General"}
              </Badge>
              <Badge variant={getStatusBadgeVariant(application.status)}>{getApplicationStatus(application)}</Badge>
            </CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">
            Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Your Proposal:</p>
          <p className="text-sm text-muted-foreground">{application.proposal}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Case posted: {formatDate(application.case.created_at)}</span>
          </div>
          {application.price && (
            <div className="flex items-center gap-2">
              <span>Your price offer: ${application.price}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>Client: {application.case.client.full_name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="ml-auto" asChild>
          <a href={`/dashboard/cases/${application.case_id}`}>
            View Case Details <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
