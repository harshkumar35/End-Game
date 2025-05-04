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
  const { supabase, user } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">LegalSathi</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home size={14} />
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 text-muted-foreground"
              >
                <Briefcase size={14} />
                Services
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/lawyers" className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Find Lawyers</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-assistant" className="flex items-center gap-2">
                    <Bot size={14} />
                    <span>AI Assistant</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/legal-news" className="flex items-center gap-2">
                    <Newspaper size={14} />
                    <span>Legal News</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/posts" className="flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span>Community</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/posts"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/posts" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageSquare size={14} />
            Community
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Phone size={14} />
            Contact
          </Link>
        </nav>
        <div className="flex-1" />
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User size={18} />
                      <span>Account</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        <button className="md:hidden ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={16} />
              Home
            </Link>

            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Briefcase size={16} />
                Services
              </div>
              <div className="pl-6 space-y-2 border-l border-muted">
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
                      Sign Out
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
                      <Button className="w-full">Sign Up</Button>
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
