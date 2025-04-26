"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Calendar, MapPin, DollarSign, User, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function CasesPage() {
  const router = useRouter()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [cases, setCases] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [proposal, setProposal] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // First fetch the lawyer's existing applications
        const { data: existingApplications, error: applicationsError } = await supabase
          .from("case_applications")
          .select("case_id")
          .eq("lawyer_id", user.id)

        if (applicationsError) throw applicationsError

        // Store existing applications for filtering
        const appliedCaseIds = existingApplications?.map((app) => app.case_id) || []
        setApplications(appliedCaseIds)

        // Fetch all open cases that the lawyer hasn't applied to yet
        const { data: openCases, error: casesError } = await supabase
          .from("cases")
          .select(`
            *,
            client:client_id (full_name, email)
          `)
          .eq("status", "open")
          .order("created_at", { ascending: false })

        if (casesError) throw casesError

        // Filter out cases that the lawyer has already applied to
        const filteredCases = openCases?.filter((caseItem) => !appliedCaseIds.includes(caseItem.id)) || []
        setCases(filteredCases)
      } catch (error) {
        console.error("Error fetching cases:", error)
        toast({
          title: "Error",
          description: "Failed to load cases. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [supabase, user])

  // Handle opening the apply dialog
  const handleOpenApplyDialog = (caseData: any) => {
    setSelectedCase(caseData)
    setProposal("")
    setPrice("")
    setDialogOpen(true)
  }

  // Handle submitting an application
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedCase) return

    setIsSubmitting(true)
    try {
      // Check if already applied (double-check)
      const { data: existingApp, error: checkError } = await supabase
        .from("case_applications")
        .select("id")
        .eq("lawyer_id", user.id)
        .eq("case_id", selectedCase.id)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingApp) {
        toast({
          title: "Already applied",
          description: "You have already applied to this case.",
          variant: "destructive",
        })
        setDialogOpen(false)
        return
      }

      // Submit the application
      const { error: applicationError } = await supabase.from("case_applications").insert({
        case_id: selectedCase.id,
        lawyer_id: user.id,
        proposal: proposal,
        price: price ? Number.parseFloat(price) : null,
        status: "pending",
      })

      if (applicationError) throw applicationError

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })

      // Update local state
      setApplications([...applications, selectedCase.id])
      setCases(cases.filter((c) => c.id !== selectedCase.id))
      setDialogOpen(false)
    } catch (error: any) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user is not authenticated or not a lawyer, redirect
  if (!authLoading && !user) {
    router.push("/login?redirect=/dashboard/cases")
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Cases</h1>
        <p className="text-muted-foreground">Browse available cases from clients seeking legal assistance</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : cases.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="overflow-hidden hover:border-primary/20 transition-all">
              <CardHeader>
                <CardTitle className="line-clamp-1">{caseItem.title}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">
                    {caseItem.case_type || "General"}
                  </Badge>
                  <span className="text-xs">Case #{caseItem.id.substring(0, 8)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground mb-4">{caseItem.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted on {formatDate(caseItem.created_at)}</span>
                  </div>
                  {caseItem.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{caseItem.location}</span>
                    </div>
                  )}
                  {caseItem.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Budget: ${caseItem.budget}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Posted by: {caseItem.client.full_name}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gradient-bg w-full" onClick={() => handleOpenApplyDialog(caseItem)}>
                  Apply for Case
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No available cases</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              You've applied to all available cases or there are no open cases at the moment. Check back later for new
              opportunities.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Case</DialogTitle>
            <DialogDescription>
              Submit your proposal for this case. Be clear about your expertise and how you can help.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply}>
            <div className="space-y-4 py-4">
              {selectedCase && (
                <div className="border rounded-lg p-4 bg-muted/40 mb-4">
                  <h3 className="font-medium">{selectedCase.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{selectedCase.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="proposal">Your Proposal</Label>
                <Textarea
                  id="proposal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Explain why you're the right lawyer for this case and how you can help..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Your Price Offer (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank if you want to discuss pricing after connecting with the client.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gradient-bg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
