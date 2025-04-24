"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Settings,
  PenTool,
  Briefcase,
  FileCheck,
  FilePlus,
  Newspaper,
} from "lucide-react"

interface DashboardNavProps {
  userRole: string
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const commonLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
    },
    {
      href: "/dashboard/new-post",
      label: "Create Post",
      icon: PenTool,
    },
    {
      href: "/legal-news",
      label: "Legal News",
      icon: Newspaper,
    },
  ]

  const clientLinks = [
    {
      href: "/dashboard/post-case",
      label: "Post a Case",
      icon: FilePlus,
    },
    {
      href: "/dashboard/my-cases",
      label: "My Cases",
      icon: Briefcase,
    },
    {
      href: "/dashboard/lawyers",
      label: "Find Lawyers",
      icon: Users,
    },
  ]

  const lawyerLinks = [
    {
      href: "/dashboard/cases",
      label: "Browse Cases",
      icon: FileText,
    },
    {
      href: "/dashboard/my-applications",
      label: "My Applications",
      icon: FileCheck,
    },
    {
      href: "/dashboard/document-generator",
      label: "Document Generator",
      icon: FilePlus,
    },
  ]

  const links = [...commonLinks, ...(userRole === "lawyer" ? lawyerLinks : clientLinks)]

  return (
    <nav className="grid items-start gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === link.href ? "bg-accent" : "transparent",
          )}
        >
          <link.icon className="mr-2 h-4 w-4" />
          <span>{link.label}</span>
        </Link>
      ))}
      <Link
        href="/settings"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/settings" ? "bg-accent" : "transparent",
        )}
      >
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  )
}
