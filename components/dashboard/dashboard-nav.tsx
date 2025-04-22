"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Settings,
  Briefcase,
  Search,
  Star,
  PenSquare,
} from "lucide-react"

interface DashboardNavProps {
  userRole: string
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const clientRoutes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Overview",
    },
    {
      href: "/dashboard/post-case",
      icon: FileText,
      title: "Post a Case",
    },
    {
      href: "/dashboard/my-cases",
      icon: Briefcase,
      title: "My Cases",
    },
    {
      href: "/dashboard/find-lawyers",
      icon: Search,
      title: "Find Lawyers",
    },
    {
      href: "/dashboard/messages",
      icon: MessageSquare,
      title: "Messages",
    },
    {
      href: "/dashboard/new-post",
      icon: PenSquare,
      title: "Create Post",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  const lawyerRoutes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Overview",
    },
    {
      href: "/dashboard/cases",
      icon: Briefcase,
      title: "Browse Cases",
    },
    {
      href: "/dashboard/my-applications",
      icon: FileText,
      title: "My Applications",
    },
    {
      href: "/dashboard/messages",
      icon: MessageSquare,
      title: "Messages",
    },
    {
      href: "/dashboard/new-post",
      icon: PenSquare,
      title: "Create Post",
    },
    {
      href: "/dashboard/reviews",
      icon: Star,
      title: "Reviews",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  const routes = userRole === "lawyer" ? lawyerRoutes : clientRoutes

  return (
    <nav className="grid gap-2 py-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={pathname === route.href ? "secondary" : "ghost"}
          className={cn(
            "justify-start",
            pathname === route.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
          )}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="mr-2 h-4 w-4" />
            {route.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
