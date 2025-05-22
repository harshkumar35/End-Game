"use client"

import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"
import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Create a simple Supabase client for client-side use
function createSimpleSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseKey)
}

export default function LawyersPage({
  searchParams = { specialization: undefined, search: undefined },
}: {
  searchParams?: { specialization?: string; search?: string }
}) {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [lawyerProfiles, setLawyerProfiles] = useState<any[]>([])
  const [uniqueSpecializations, setUniqueSpecializations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const supabase = createSimpleSupabaseClient()

        // First, check if the avatar_url column exists
        const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
          table_name: "users",
        })

        if (columnsError) {
          console.error("Error checking columns:", columnsError)
          // Continue without checking columns
        }

        // Build query to get lawyers with role = 'lawyer'
        // Only select avatar_url if it exists
        const hasAvatarColumn = Array.isArray(columns) && columns.includes("avatar_url")

        let query = supabase
          .from("users")
          .select(hasAvatarColumn ? `id, email, full_name, role, avatar_url` : `id, email, full_name, role`)
          .eq("role", "lawyer")

        // Apply search filter if provided
        if (searchParams.search) {
          query = query.ilike("full_name", `%${searchParams.search}%`)
        }

        const { data: lawyersData, error: lawyersError } = await query

        if (lawyersError) {
          console.error("Error fetching lawyers:", lawyersError)
          throw lawyersError
        }

        setLawyers(lawyersData || [])

        // Get lawyer profiles in a separate query
        const { data: profilesData, error: profilesError } = await supabase.from("lawyer_profiles").select("*")

        if (profilesError) {
          console.error("Error fetching lawyer profiles:", profilesError)
          // Continue without profiles rather than failing completely
        } else {
          setLawyerProfiles(profilesData || [])

          // Get all unique specializations for filter
          const specializations: string[] = []
          profilesData?.forEach((profile) => {
            if (profile && profile.specialization && !specializations.includes(profile.specialization)) {
              specializations.push(profile.specialization)
            }
          })
          setUniqueSpecializations(specializations)
        }
      } catch (err) {
        console.error("Error in LawyersPage:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams.search, searchParams.specialization])

  // Create a map of profiles by user_id for easy lookup
  const profilesMap = new Map()
  lawyerProfiles.forEach((profile) => {
    if (profile && profile.user_id) {
      profilesMap.set(profile.user_id, profile)
    }
  })

  // Combine lawyers with their profiles
  const lawyersWithProfiles = lawyers.map((lawyer) => ({
    ...lawyer,
    lawyer_profiles: profilesMap.has(lawyer.id) ? [profilesMap.get(lawyer.id)] : [],
  }))

  // Filter by specialization if needed
  let filteredLawyers = lawyersWithProfiles
  if (searchParams.specialization && searchParams.specialization !== "all") {
    filteredLawyers = lawyersWithProfiles.filter(
      (lawyer) =>
        lawyer.lawyer_profiles?.length > 0 && lawyer.lawyer_profiles[0]?.specialization === searchParams.specialization,
    )
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Find Lawyers</h1>
            <p className="text-muted-foreground">Connect with experienced lawyers for your legal needs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-white/10 p-6 animate-pulse">
              <div className="h-12 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
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
          {!searchParams.search && !searchParams.specialization && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                It looks like no lawyers have registered yet. You can:
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a href="/register?role=lawyer">Register as a Lawyer</a>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
