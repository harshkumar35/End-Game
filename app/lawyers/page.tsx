import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

export const dynamic = "force-dynamic"

// Create a simple Supabase client for server-side use
function createSimpleSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseKey)
}

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: { specialization?: string; search?: string }
}) {
  const supabase = createSimpleSupabaseClient()

  try {
    // Build query to get lawyers with role = 'lawyer'
    let query = supabase.from("users").select(`id, email, full_name, role`).eq("role", "lawyer")

    // Apply search filter if provided
    if (searchParams.search) {
      query = query.ilike("full_name", `%${searchParams.search}%`)
    }

    const { data: lawyers, error } = await query

    if (error) {
      console.error("Error fetching lawyers:", error)
      throw error
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
            {!searchParams.search && !searchParams.specialization && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  It looks like no lawyers have registered yet. You can:
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <a href="/register?role=lawyer">Register as a Lawyer</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/lawyers">Refresh Page</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in LawyersPage:", error)
    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Find Lawyers</h1>
            <p className="text-muted-foreground">Connect with experienced lawyers for your legal needs</p>
          </div>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-500">Error loading lawyers</h3>
          <p className="text-muted-foreground mt-1">
            There was an error loading the lawyers. This might be due to database connectivity issues.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Error details: {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/lawyers">Try Again</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/register?role=lawyer">Register as a Lawyer</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
