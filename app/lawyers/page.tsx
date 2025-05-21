"use client"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: { specialization?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()

  try {
    // First, check if the users table exists and what columns it has
    const { data: userColumns, error: columnsError } = await supabase
      .rpc("get_table_columns", {
        table_name: "users",
      })
      .catch(() => ({ data: null, error: new Error("Could not check table columns") }))

    // Default columns to select
    let selectColumns = `
      id,
      email,
      full_name,
      role
    `

    // Add avatar_url if it exists
    if (userColumns && Array.isArray(userColumns) && userColumns.includes("avatar_url")) {
      selectColumns = `
        id,
        email,
        full_name,
        role,
        avatar_url
      `
    }

    // Build query to get lawyers with role = 'lawyer'
    let query = supabase.from("users").select(selectColumns).eq("role", "lawyer")

    // Apply search filter if provided
    if (searchParams.search) {
      query = query.ilike("full_name", `%${searchParams.search}%`)
    }

    const { data: lawyers, error } = await query

    if (error) {
      console.error("Error fetching lawyers:", error)
      throw error
    }

    // Fallback if the RPC method fails - try a simpler query
    if (!lawyers) {
      const { data: simpleLawyers, error: simpleError } = await supabase
        .from("users")
        .select("id, email, full_name, role")
        .eq("role", "lawyer")

      if (simpleError) {
        console.error("Error with fallback lawyer query:", simpleError)
        throw simpleError
      }

      const lawyers = simpleLawyers
    }

    // Get lawyer profiles in a separate query
    const { data: lawyerProfiles, error: profilesError } = await supabase.from("lawyer_profiles").select("*")

    if (profilesError) {
      console.error("Error fetching lawyer profiles:", profilesError)
      // Continue without profiles rather than failing completely
    }

    // Create a map of profiles by user_id for easy lookup
    const profilesMap = new Map()
    if (lawyerProfiles && Array.isArray(lawyerProfiles)) {
      lawyerProfiles.forEach((profile) => {
        if (profile && profile.user_id) {
          profilesMap.set(profile.user_id, profile)
        }
      })
    }

    // Combine lawyers with their profiles
    const lawyersWithProfiles =
      lawyers && Array.isArray(lawyers)
        ? lawyers.map((lawyer) => ({
            ...lawyer,
            lawyer_profiles: profilesMap.has(lawyer.id) ? [profilesMap.get(lawyer.id)] : [],
          }))
        : []

    // Filter by specialization if needed
    let filteredLawyers = lawyersWithProfiles
    if (searchParams.specialization && searchParams.specialization !== "all") {
      filteredLawyers = lawyersWithProfiles.filter(
        (lawyer) =>
          lawyer.lawyer_profiles?.length > 0 &&
          lawyer.lawyer_profiles[0]?.specialization === searchParams.specialization,
      )
    }

    // Get all unique specializations for filter
    const uniqueSpecializations: string[] = []
    if (lawyerProfiles && Array.isArray(lawyerProfiles)) {
      lawyerProfiles.forEach((profile) => {
        if (profile && profile.specialization && !uniqueSpecializations.includes(profile.specialization)) {
          uniqueSpecializations.push(profile.specialization)
        }
      })
    }

    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Find Lawyers</h1>
            <p className="text-muted-foreground">Connect with experienced lawyers for your legal needs</p>
          </div>

          <SpecializationFilter searchParams={searchParams} uniqueSpecializations={uniqueSpecializations} />
        </div>

        {filteredLawyers && filteredLawyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No lawyers found</h3>
            <p className="text-muted-foreground mt-1">
              {searchParams.search || searchParams.specialization
                ? "Try adjusting your filters"
                : "No lawyers are currently available"}
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in LawyersPage:", error)
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-500">Error loading lawyers</h3>
          <p className="text-muted-foreground mt-1">There was an error loading the lawyers. Please try again later.</p>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
