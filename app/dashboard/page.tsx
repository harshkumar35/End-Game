import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, MessageSquare, Users, Briefcase, ArrowUpRight } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user data including role
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  const userRole = userData?.role || "client"

  // Get relevant data based on user role
  let activeCases = []
  let messages = []

  if (userRole === "client") {
    // Get client's cases
    const { data: cases } = await supabase
      .from("cases")
      .select("*")
      .eq("client_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    activeCases = cases || []

    // Get client's messages
    const { data: clientMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_id", session.user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5)

    messages = clientMessages || []
  } else if (userRole === "lawyer") {
    // Get lawyer's applications
    const { data: applications } = await supabase
      .from("case_applications")
      .select("*, cases(*)")
      .eq("lawyer_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    activeCases = applications || []

    // Get lawyer's messages
    const { data: lawyerMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_id", session.user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5)

    messages = lawyerMessages || []
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userData?.full_name}! Here's what's happening with your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "client" ? "Active Cases" : "Applications"}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases.length}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === "client" ? "+2 cases this month" : "+5 applications this month"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">+7 since last login</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "client" ? "Lawyer Proposals" : "Case Matches"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 in the last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "client" ? "Lawyers Viewed" : "Profile Views"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+10% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your {userRole === "client" ? "cases" : "applications"} and their current status
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={userRole === "client" ? "/dashboard/my-cases" : "/dashboard/my-applications"}>
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pl-2">
                {activeCases.length > 0 ? (
                  <ul className="space-y-4">
                    {activeCases.slice(0, 3).map((item: any) => (
                      <li key={item.id} className="flex items-start gap-4 rounded-md p-2 hover:bg-muted">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {userRole === "client" ? item.title : item.cases?.title || "Case Title"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userRole === "client" ? `Status: ${item.status}` : `Status: ${item.status}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                      {userRole === "client"
                        ? "You don't have any active cases yet."
                        : "You haven't applied to any cases yet."}
                    </p>
                    <Button asChild className="gradient-bg">
                      <Link href={userRole === "client" ? "/dashboard/post-case" : "/dashboard/cases"}>
                        {userRole === "client" ? "Post a Case" : "Browse Cases"}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>You have {messages.length} unread messages</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/dashboard/messages">
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {messages.length > 0 ? (
                  <ul className="space-y-4">
                    {messages.slice(0, 3).map((message: any) => (
                      <li key={message.id} className="flex items-start gap-4 rounded-md p-2 hover:bg-muted">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                          <MessageSquare className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">New message</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="mb-4 text-muted-foreground">You don't have any unread messages.</p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/messages">View All Messages</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics about your activity</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Analytics dashboard coming soon</p>
                <div className="w-64 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and download reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Reports dashboard coming soon</p>
                <div className="w-64 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
