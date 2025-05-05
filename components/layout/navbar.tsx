"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSupabase } from "@/lib/supabase/provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, User, ChevronDown, Bot, Newspaper, Users, MessageSquare, Phone, Home, Briefcase } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { supabase, user, isLoading } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return

    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
      // Use a more reliable way to navigate
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Add error boundary for the component
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      // Check if this is an auth-related error or Botpress error
      const errorString = args.join(" ")
      if (
        errorString.includes("auth") ||
        errorString.includes("supabase") ||
        errorString.includes("Botpress") ||
        errorString.includes("botpress")
      ) {
        // Log but don't crash the component
        originalError("Error caught by Navbar error boundary:", ...args)
      } else {
        originalError(...args)
      }
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "glass backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold animated-gradient-text">LegalSathi</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home size={14} className="animate-pulse-soft" />
            <span className="relative overflow-hidden">
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left hover:scale-x-100"></span>
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 text-muted-foreground group"
              >
                <Briefcase size={14} className="group-hover:animate-pulse-soft" />
                <span className="relative overflow-hidden">
                  Services
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </span>
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 glass backdrop-blur-md animate-fade-in-down">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/lawyers" className="flex items-center gap-2 group">
                    <Users size={14} className="group-hover:text-primary transition-colors" />
                    <span className="relative overflow-hidden">
                      Find Lawyers
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/ai-assistant" className="flex items-center gap-2 group">
                    <Bot size={14} className="group-hover:text-primary transition-colors" />
                    <span className="relative overflow-hidden">
                      AI Assistant
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/legal-news" className="flex items-center gap-2 group">
                    <Newspaper size={14} className="group-hover:text-primary transition-colors" />
                    <span className="relative overflow-hidden">
                      Legal News
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/posts" className="flex items-center gap-2 group">
                    <MessageSquare size={14} className="group-hover:text-primary transition-colors" />
                    <span className="relative overflow-hidden">
                      Community
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/posts"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/posts" ? "text-primary" : "text-muted-foreground"
            } group`}
          >
            <MessageSquare size={14} className="group-hover:animate-pulse-soft" />
            <span className="relative overflow-hidden">
              Community
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
            </span>
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            } group`}
          >
            <Phone size={14} className="group-hover:animate-pulse-soft" />
            <span className="relative overflow-hidden">
              Contact
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
            </span>
          </Link>
        </nav>
        <div className="flex-1" />
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isLoading ? (
            // Show a simple loading state instead of a skeleton
            <Button variant="ghost" disabled>
              <span className="w-20 h-4 bg-muted animate-pulse rounded"></span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 group">
                  <User size={18} className="group-hover:text-primary transition-colors" />
                  <span className="relative overflow-hidden">
                    Account
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                  </span>
                  <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass backdrop-blur-md animate-fade-in-down">
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/dashboard" className="group">
                    <span className="relative overflow-hidden">
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10">
                  <Link href="/profile" className="group">
                    <span className="relative overflow-hidden">
                      Profile
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="focus:bg-primary/10 group">
                  <span className="relative overflow-hidden">
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className="relative overflow-hidden group">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Button>
              </Link>
              <Link href="/register">
                <Button className="relative overflow-hidden group elemental-water">
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Button>
              </Link>
            </div>
          )}
        </div>
        <button className="md:hidden ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="transition-transform hover:scale-110" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden glass backdrop-blur-md border-t border-white/10 p-4 animate-fade-in-down">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={16} className="animate-pulse-soft" />
              Home
            </Link>

            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Briefcase size={16} className="animate-pulse-soft" />
                Services
              </div>
              <div className="pl-6 space-y-2 border-l border-white/10">
                <Link
                  href="/lawyers"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    pathname === "/lawyers" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users size={14} />
                  Find Lawyers
                </Link>
                <Link
                  href="/ai-assistant"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    pathname === "/ai-assistant" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bot size={14} />
                  AI Assistant
                </Link>
                <Link
                  href="/legal-news"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    pathname === "/legal-news" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Newspaper size={14} />
                  Legal News
                </Link>
                <Link
                  href="/posts"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    pathname === "/posts" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare size={14} />
                  Community
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                pathname === "/contact" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={16} />
              Contact
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start px-2 flex items-center gap-2"
                      disabled={isSigningOut}
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full elemental-water">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
