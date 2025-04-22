import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MobileNav userRole={userRole} />
          <DashboardHeader user={userData} />
        </div>
      </div>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <DashboardNav userRole={userRole} />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
