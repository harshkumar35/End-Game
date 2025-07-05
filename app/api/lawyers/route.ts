import { type NextRequest, NextResponse } from "next/server"
import { createServiceSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")
    const search = searchParams.get("search")

    const supabase = createServiceSupabaseClient()

    // Build query to get lawyers with role = 'lawyer'
    let query = supabase
      .from("users")
      .select(`
        id,
        email,
        full_name,
        role,
        avatar_url,
        created_at,
        lawyer_profiles (
          specialization,
          experience_years,
          hourly_rate,
          bio,
          location,
          rating,
          is_available
        )
      `)
      .eq("role", "lawyer")

    // Apply search filter if provided
    if (search) {
      query = query.ilike("full_name", `%${search}%`)
    }

    const { data: lawyers, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching lawyers:", error)
      return NextResponse.json({ error: "Failed to fetch lawyers" }, { status: 500 })
    }

    // Filter by specialization if needed
    let filteredLawyers = lawyers || []
    if (specialization && specialization !== "all") {
      filteredLawyers = (lawyers || []).filter(
        (lawyer) => lawyer.lawyer_profiles?.length > 0 && lawyer.lawyer_profiles[0]?.specialization === specialization,
      )
    }

    return NextResponse.json({ lawyers: filteredLawyers })
  } catch (error) {
    console.error("Error in lawyers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
