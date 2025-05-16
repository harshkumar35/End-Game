import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: { specialization?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()

  try {
    console.log("Fetching lawyers...")

    // Build query to get lawyers with role = 'lawyer'
    let query = supabase
      .from("users")
      .select(`
        id,
        email,
        full_name,
        role,
        avatar_url
      `)
      .eq("role", "lawyer")

    // Apply search filter if provided
    if (searchParams.search) {
      query = query.ilike("full_name", `%${searchParams.search}%`)
    }

    const { data: lawyers, error } = await query

    if (error) {
      console.error("Error fetching lawyers:", error)
      throw error
    }

    console.log(`Found ${lawyers?.length || 0} lawyers`)

    // Get lawyer profiles in a separate query to avoid the join issues
    const { data: lawyerProfiles, error: profilesError } = await supabase.from("lawyer_profiles").select("*")

    if (profilesError) {
      console.error("Error fetching lawyer profiles:", profilesError)
      // Continue without profiles rather than failing completely
    }

    // Create a map of profiles by user_id for easy lookup
    const profilesMap = new Map()
    lawyerProfiles?.forEach((profile) => {
      profilesMap.set(profile.user_id, profile)
    })

    // Combine lawyers with their profiles
    const lawyersWithProfiles =
      lawyers?.map((lawyer) => ({
        ...lawyer,
        lawyer_profiles: profilesMap.has(lawyer.id) ? [profilesMap.get(lawyer.id)] : [],
      })) || []

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
    lawyerProfiles?.forEach((profile) => {
      if (profile.specialization && !uniqueSpecializations.includes(profile.specialization)) {
        uniqueSpecializations.push(profile.specialization)
      }
    })

    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Find Lawyers</h1>
            <p className="text-muted-foreground">Connect with experienced lawyers for your legal needs</p>
          </div>

          <SpecializationFilter searchParams={searchParams} uniqueSpecializations={uniqueSpecializations} />
        </div>

        {filteredLawyers.length > 0 ? (
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
            <pre className="bg-muted p-4 rounded-md text-left overflow-auto max-h-[200px] text-xs">
              {error instanceof Error ? error.message : "Unknown error"}
            </pre>
          </div>
        </div>
      </div>
    )
  }
}
