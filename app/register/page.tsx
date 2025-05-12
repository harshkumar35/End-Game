"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: searchParams.get("role") || "client",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .limit(1)

      if (checkError) throw checkError

      // If email already exists, show friendly message
      if (existingUsers && existingUsers.length > 0) {
        setError("An account with this email already exists. Please login instead.")
        setIsLoading(false)
        return
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
          // Explicitly set the redirect URL to the production domain
          emailRedirectTo: "https://v0-legalsathi.vercel.app/auth/callback",
        },
      })

      if (authError) {
        // Check for duplicate email error
        if (authError.message.includes("already registered")) {
          setError("An account with this email already exists. Please login instead.")
          setIsLoading(false)
          return
        }
        throw authError
      }

      // Insert the user into our users table
      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: formData.role,
        })

        if (profileError) {
          // Check for duplicate email error
          if (profileError.message.includes("users_email_key")) {
            setError("An account with this email already exists. Please login instead.")
            setIsLoading(false)
            return
          }
          throw profileError
        }

        // If user is a lawyer, create a lawyer profile
        if (formData.role === "lawyer") {
          const { error: lawyerProfileError } = await supabase.from("lawyer_profiles").insert({
            user_id: authData.user.id,
            specialization: "",
            experience: 0,
            hourly_rate: 0,
            bio: `I am a lawyer specializing in various legal matters.`,
            is_available: true,
          })

          if (lawyerProfileError) throw lawyerProfileError
        }

        setSuccess("Registration successful! Please check your email to confirm your account.")

        // If email confirmation is not required, redirect to onboarding
        if (!authData.user.email_confirmed_at) {
          toast({
            title: "Registration successful!",
            description: "Please check your email to confirm your account, then return to login.",
          })
        } else {
          // Redirect based on role
          if (formData.role === "lawyer") {
            router.push("/onboarding/lawyer")
          } else {
            router.push("/dashboard")
          }
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error)

      // Check for duplicate email error in the error message
      if (
        error.message &&
        (error.message.includes("already registered") ||
          error.message.includes("users_email_key") ||
          error.message.includes("duplicate key"))
      ) {
        setError("An account with this email already exists. Please login instead.")
      } else {
        setError(error.message || "Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // If still checking auth state, show loading
  if (authLoading) {
    return (
      <div className="container flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If user is already logged in, don't show the register form
  if (user) {
    return null
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Sign up to get started with LegalSathi</CardDescription>
        </CardHeader>

        {/* Add the process information alert */}
        <Alert className="mx-6 mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-600 dark:text-blue-400 font-medium">Registration Process</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
            1. Enter your details and create your account
            <br />
            2. Check your email and click the confirmation link
            <br />
            3. Return to LegalSathi and login with your credentials
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-primary/10 text-primary border-primary/20">
                <AlertDescription>
                  {success}{" "}
                  <span className="font-semibold">
                    Please click the confirmation link in your email, then return to login.
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client looking for legal help</SelectItem>
                  <SelectItem value="lawyer">Lawyer offering services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full gradient-bg" disabled={isLoading || !!success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
