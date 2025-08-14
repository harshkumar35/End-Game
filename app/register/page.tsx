"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail, User, Lock, Phone, MapPin } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { RoleSelector } from "@/components/auth/role-selector"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    location: "",
    role: searchParams.get("role") || "client",
    // Lawyer specific fields
    specialization: "General Practice",
    experience: "0",
    hourlyRate: "1000",
    bio: "",
    barRegistrationNumber: "",
    languages: "English, Hindi",
    education: "",
    certifications: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error("Please fill in all required fields")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      console.log("Starting registration process...")

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      console.log("User created:", authData.user.id)

      // Create user profile in our users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone || null,
        location: formData.location || null,
        role: formData.role,
      })

      if (profileError && !profileError.message.includes("duplicate key")) {
        console.error("Profile creation error:", profileError)
      }

      // If user is a lawyer, create a lawyer profile automatically
      if (formData.role === "lawyer") {
        console.log("Creating lawyer profile...")

        const { error: lawyerProfileError } = await supabase.from("lawyer_profiles").insert({
          user_id: authData.user.id,
          specialization: formData.specialization,
          experience: Number.parseInt(formData.experience) || 0,
          hourly_rate: Number.parseFloat(formData.hourlyRate) || 1000,
          bio:
            formData.bio ||
            `I am a ${formData.specialization} lawyer with ${formData.experience} years of experience. I am here to help you with your legal needs.`,
          is_available: true,
          bar_registration_number: formData.barRegistrationNumber || null,
          languages: formData.languages
            .split(",")
            .map((lang) => lang.trim())
            .filter(Boolean),
          education: formData.education ? formData.education.split("\n").filter(Boolean) : [],
          certifications: formData.certifications ? formData.certifications.split("\n").filter(Boolean) : [],
        })

        if (lawyerProfileError && !lawyerProfileError.message.includes("duplicate key")) {
          console.error("Lawyer profile creation error:", lawyerProfileError)
        } else {
          console.log("Lawyer profile created successfully")
        }
      }

      setSuccess("Registration successful! Please check your email to confirm your account.")

      toast({
        title: "Registration successful!",
        description:
          formData.role === "lawyer"
            ? "Your lawyer profile has been created. Please check your email to confirm your account."
            : "Please check your email to confirm your account.",
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login?message=signup-success")
      }, 2000)
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // If still checking auth state, show loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <AuthLayout title="Create an account" subtitle="Join LegalSathi to get started">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert className="bg-primary/10 text-primary border-primary/20">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">I am a</Label>
            <RoleSelector selectedRole={formData.role} onRoleChange={handleRoleChange} />
          </div>

          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                name="phone"
                placeholder="+91-9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="location"
                name="location"
                placeholder="Mumbai, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lawyer-specific fields */}
          {formData.role === "lawyer" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t pt-4"
            >
              <h3 className="text-lg font-medium">Professional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                    <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                    <SelectItem value="Criminal Defense">Criminal Defense</SelectItem>
                    <SelectItem value="Family Law">Family Law</SelectItem>
                    <SelectItem value="Civil Law">Civil Law</SelectItem>
                    <SelectItem value="Property Law">Property Law</SelectItem>
                    <SelectItem value="Labor Law">Labor Law</SelectItem>
                    <SelectItem value="Tax Law">Tax Law</SelectItem>
                    <SelectItem value="Immigration Law">Immigration Law</SelectItem>
                    <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Experience (Years)
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-sm font-medium">
                    Hourly Rate (₹)
                  </Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Tell us about your legal expertise and experience..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barRegistrationNumber" className="text-sm font-medium">
                  Bar Registration Number
                </Label>
                <Input
                  id="barRegistrationNumber"
                  name="barRegistrationNumber"
                  placeholder="BAR/2020/MH/1234"
                  value={formData.barRegistrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages" className="text-sm font-medium">
                  Languages (comma-separated)
                </Label>
                <Input
                  id="languages"
                  name="languages"
                  placeholder="English, Hindi, Marathi"
                  value={formData.languages}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="text-sm font-medium">
                  Education (one per line)
                </Label>
                <Textarea
                  id="education"
                  name="education"
                  rows={3}
                  placeholder="LLB from Mumbai University (2015)&#10;LLM in Corporate Law (2017)"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications" className="text-sm font-medium">
                  Certifications (one per line)
                </Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  rows={3}
                  placeholder="Certified Company Secretary&#10;Best Lawyer Award 2022"
                  value={formData.certifications}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={isLoading || !!success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${formData.role} account`
              )}
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline transition-colors">
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
