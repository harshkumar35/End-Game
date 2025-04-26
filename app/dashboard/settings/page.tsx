"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isLawyer, setIsLawyer] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Check if user is a lawyer
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()

        if (userError) throw userError

        const userIsLawyer = userData?.role === "lawyer"
        setIsLawyer(userIsLawyer)

        if (userIsLawyer) {
          // Fetch lawyer profile
          const { data: lawyerData, error: lawyerError } = await supabase
            .from("lawyer_profiles")
            .select("is_available")
            .eq("user_id", user.id)
            .single()

          if (lawyerError && lawyerError.code !== "PGRST116") throw lawyerError

          setIsAvailable(lawyerData?.is_available ?? false)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [supabase, user])

  const handleAvailabilityToggle = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Check if lawyer profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("lawyer_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("lawyer_profiles")
          .update({ is_available: !isAvailable })
          .eq("user_id", user.id)

        if (updateError) throw updateError
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from("lawyer_profiles")
          .insert({ user_id: user.id, is_available: true })

        if (insertError) throw insertError
      }

      setIsAvailable(!isAvailable)
      toast({
        title: "Settings updated",
        description: `You are now ${!isAvailable ? "available" : "not available"} for new cases.`,
      })
    } catch (error: any) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update your availability status.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // If user is not authenticated, redirect
  if (!authLoading && !user) {
    router.push("/login?redirect=/dashboard/settings")
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {isLoading ? (
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded mb-4"></div>
          </CardContent>
        </Card>
      ) : (
        <>
          {isLawyer && (
            <Card>
              <CardHeader>
                <CardTitle>Availability Status</CardTitle>
                <CardDescription>
                  Control whether you're available to take on new cases. When turned off, you won't appear in client
                  searches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="availability-mode"
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                    disabled={isSaving}
                  />
                  <label
                    htmlFor="availability-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {isAvailable ? "Available for new cases" : "Not available for new cases"}
                  </label>
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {isAvailable
                  ? "Clients can see your profile and send you case requests."
                  : "Your profile is hidden from client searches."}
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/profile")} variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notification settings will be available soon.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
