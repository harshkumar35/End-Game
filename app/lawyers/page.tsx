import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { SpecializationFilter } from "@/components/lawyers/specialization-filter"

export const dynamic = "force-dynamic"

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: { specialization?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Apply filters
  let query = supabase
    .from("users")
    .select(`
      *,
      lawyer_profiles(*)
    `)
    .eq("role", "lawyer")
    // Only show lawyers who are available
    .eq("lawyer_profiles.is_available", true)
    .order("created_at", { ascending: false })

  // Apply specialization filter if provided
  if (searchParams.specialization && searchParams.specialization !== "all") {
    query = query.eq("lawyer_profiles.specialization", searchParams.specialization)
  }

  // Apply search filter if provided
  if (searchParams.search) {
    query = query.ilike("full_name", `%${searchParams.search}%`)
  }

  const { data: lawyers } = await query

  // Get unique specializations for the filter dropdown
  const { data: specializations } = await supabase
    .from("lawyer_profiles")
    .select("specialization")
    .not("specialization", "is", null)
    .eq("is_available", true)

  const uniqueSpecializations = Array.from(new Set(specializations?.map((item) => item.specialization).filter(Boolean)))

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find a Lawyer</h1>
        <p className="text-muted-foreground">Browse our network of qualified legal professionals</p>
      </div>

      <SpecializationFilter searchParams={searchParams} uniqueSpecializations={uniqueSpecializations} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {lawyers && lawyers.length > 0 ? (
          lawyers.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No lawyers found</h3>
            <p className="text-muted-foreground mb-6">
              {searchParams.search || searchParams.specialization
                ? "Try changing your search criteria or filters"
                : "No lawyers are currently available. Please check back later."}
            </p>
            <Button asChild variant="outline">
              <Link href="/lawyers">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
