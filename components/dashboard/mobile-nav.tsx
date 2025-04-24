"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userRole: string
}

export function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const clientRoutes = [
    {
      href: "/dashboard",
      title: "Overview",
    },
    {
      href: "/dashboard/post-case",
      title: "Post a Case",
    },
    {
      href: "/dashboard/my-cases",
      title: "My Cases",
    },
    {
      href: "/dashboard/find-lawyers",
      title: "Find Lawyers",
    },
    {
      href: "/dashboard/messages",
      title: "Messages",
    },
    {
      href: "/legal-news",
      title: "Legal News",
    },
    {
      href: "/dashboard/profile",
      title: "Profile",
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
    },
  ]

  const lawyerRoutes = [
    {
      href: "/dashboard",
      title: "Overview",
    },
    {
      href: "/dashboard/cases",
      title: "Browse Cases",
    },
    {
      href: "/dashboard/my-applications",
      title: "My Applications",
    },
    {
      href: "/dashboard/messages",
      title: "Messages",
    },
    {
      href: "/legal-news",
      title: "Legal News",
    },
    {
      href: "/dashboard/reviews",
      title: "Reviews",
    },
    {
      href: "/dashboard/profile",
      title: "Profile",
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
    },
  ]

  const routes = userRole === "lawyer" ? lawyerRoutes : clientRoutes

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold gradient-text">LegalSathi</span>
          </Link>
          <div className="mt-8 flex flex-col gap-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn("justify-start", pathname === route.href && "bg-muted font-medium")}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={route.href}>{route.title}</Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center">
        <span className="text-lg font-bold gradient-text">LegalSathi</span>
      </Link>
    </div>
  )
}
