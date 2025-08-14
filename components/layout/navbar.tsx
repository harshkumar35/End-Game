"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSupabase } from "@/lib/supabase/provider"

const navigation = [
  { name: "HOME", href: "/" },
  { name: "LAWYERS", href: "/lawyers" },
  { name: "SERVICES", href: "/services" },
  { name: "COMMUNITY", href: "/community" },
  { name: "LEGAL NEWS", href: "/legal-news" },
  { name: "CONTACT", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useSupabase()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-6 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LegalSathi
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/dashboard">DASHBOARD</Link>
              </Button>
              <Button asChild>
                <Link href="/profile">PROFILE</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">LOGIN</Link>
              </Button>
              <Button asChild>
                <Link href="/register">REGISTER</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          DASHBOARD
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          PROFILE
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          LOGIN
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          REGISTER
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
