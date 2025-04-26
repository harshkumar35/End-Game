"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Gavel,
  Settings,
  Newspaper,
  PenSquare,
  Briefcase,
  CheckSquare,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
}

export function DashboardNav() {
  const pathname = usePathname()
  const { user, isLoading } = useSupabase()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return

      const supabase = createClientComponentClient()
      const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single()

      if (!error && data) {
        setUserRole(data.role)
      }
    }

    fetchUserRole()
  }, [user])

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Create Post",
      href: "/dashboard/create-post",
      icon: <PenSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Document Generator",
      href: "/dashboard/document-generator",
      icon: <Gavel className="mr-2 h-4 w-4" />,
    },
    {
      title: "Legal News",
      href: "/legal-news",
      icon: <Newspaper className="mr-2 h-4 w-4" />,
    },
    {
      title: "Available Cases",
      href: "/dashboard/cases",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      roles: ["lawyer"],
    },
    {
      title: "My Applications",
      href: "/dashboard/my-applications",
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
      roles: ["lawyer"],
    },
    {
      title: "Post Case",
      href: "/dashboard/post-case",
      icon: <PenSquare className="mr-2 h-4 w-4" />,
      roles: ["client"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <nav className="grid gap-2">
      {navItems
        .filter((item) => !item.roles || !userRole || item.roles.includes(userRole))
        .map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn("justify-start", pathname === item.href ? "gradient-bg" : "")}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        ))}
    </nav>
  )
}
