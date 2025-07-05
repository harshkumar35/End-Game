import { type NextRequest, NextResponse } from "next/server"
import { createServerServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const specialization = searchParams.get("specialization") || ""
    const location = searchParams.get("location") || ""
    const experience = Number.parseInt(searchParams.get("experience") || "0")
    const availableOnly = searchParams.get("available") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const supabase = createServerServiceClient()

    let query = supabase.from("lawyer_profiles").select(`
        *,
        users!inner(
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `)

    // Apply filters
    if (search) {
      query = query.ilike("users.full_name", `%${search}%`)
    }

    if (specialization) {
      query = query.contains("specialization", [specialization])
    }

    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    if (experience > 0) {
      query = query.gte("experience_years", experience)
    }

    if (availableOnly) {
      query = query.eq("is_available", true)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: lawyers, error, count } = await query.range(from, to).order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching lawyers:", error)
      return NextResponse.json({ error: "Failed to fetch lawyers" }, { status: 500 })
    }

    // Transform data to match expected format
    const transformedLawyers = lawyers?.map((lawyer) => ({
      id: lawyer.users.id,
      full_name: lawyer.users.full_name,
      email: lawyer.users.email,
      phone: lawyer.users.phone,
      avatar_url: lawyer.users.avatar_url,
      specialization: lawyer.specialization || [],
      experience_years: lawyer.experience_years || 0,
      location: lawyer.location || "",
      bio: lawyer.bio,
      hourly_rate: lawyer.hourly_rate,
      rating: lawyer.rating || 0,
      total_reviews: lawyer.total_reviews || 0,
      is_available: lawyer.is_available || false,
      is_verified: lawyer.is_verified || false,
    }))

    return NextResponse.json({
      lawyers: transformedLawyers || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Unexpected error in lawyers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerServiceClient()

    const { data, error } = await supabase.from("lawyer_profiles").insert(body).select().single()

    if (error) {
      console.error("Error creating lawyer profile:", error)
      return NextResponse.json({ error: "Failed to create lawyer profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error creating lawyer profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
