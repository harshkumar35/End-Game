import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"

export const dynamic = "force-dynamic"

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: { specialization?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Build query
  let query = supabase
    .from("users")
    .select(
      `
      *,
      lawyer_profiles (*)
    `,
    )
    .eq("role", "lawyer")
    .eq("lawyer_profiles.is_available", true)

  // Apply specialization filter
  if (searchParams.specialization && searchParams.specialization !== "all") {
    query = query.eq("lawyer_profiles.specialization", searchParams.specialization)
  }

  // Apply search filter
  if (searchParams.search) {
    query = query.or(
      `full_name.ilike.%${searchParams.search}%,lawyer_profiles.bio.ilike.%${searchParams.search}%,lawyer_profiles.specialization.ilike.%${searchParams.search}%`,
    )
  }

  const { data: lawyers, error } = await query

  if (error) {
    console.error("Error fetching lawyers:", error)
  }

  // Get all unique specializations for filter
  const uniqueSpecializations: string[] = []
  lawyers?.forEach((lawyer) => {
    if (
      lawyer.lawyer_profiles &&
      lawyer.lawyer_profiles.length > 0 &&
      lawyer.lawyer_profiles[0].specialization &&
      !uniqueSpecializations.includes(lawyer.lawyer_profiles[0].specialization)
    ) {
      uniqueSpecializations.push(lawyer.lawyer_profiles[0].specialization)
    }
  })

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Lawyers</h1>
          <p className="text-muted-foreground">Connect with experienced lawyers for your legal needs</p>
        </div>

        <SpecializationFilter searchParams={searchParams} uniqueSpecializations={uniqueSpecializations} />
      </div>

      {lawyers?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
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
}
