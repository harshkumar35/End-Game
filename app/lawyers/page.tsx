"use client"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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

      <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Search</span>
          </div>
          <form action="/lawyers" method="get" className="relative">
            <Input name="search" placeholder="Search by name..." defaultValue={searchParams.search || ""} />
            <input type="hidden" name="specialization" value={searchParams.specialization || ""} />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">
              Search
            </Button>
          </form>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Specialization</span>
          </div>
          <form action="/lawyers" method="get" className="flex gap-2">
            <input type="hidden" name="search" value={searchParams.search || ""} />
            <select
              name="specialization"
              defaultValue={searchParams.specialization || "all"}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                e.target.form?.requestSubmit()
              }}
            >
              <option value="all">All Specializations</option>
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
            <Button type="submit">Apply</Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers && lawyers.length > 0 ? (
          lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={lawyer.avatar_url || "/placeholder.svg"} alt={lawyer.full_name} />
                    <AvatarFallback>{lawyer.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle>{lawyer.full_name}</CardTitle>
                    <CardDescription>
                      {lawyer.lawyer_profiles?.[0]?.specialization || "General Practice"}
                    </CardDescription>
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      <span className="ml-2 text-sm text-muted-foreground">(12 reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {lawyer.lawyer_profiles?.[0]?.bio ||
                      "Experienced legal professional dedicated to helping clients navigate complex legal matters."}
                  </p>
                  {lawyer.lawyer_profiles?.[0]?.headline && (
                    <Badge variant="outline">{lawyer.lawyer_profiles?.[0]?.headline}</Badge>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Experience:</span>{" "}
                      <span className="text-muted-foreground">
                        {lawyer.lawyer_profiles?.[0]?.experience || 0} years
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span>{" "}
                      <span className="text-muted-foreground">${lawyer.lawyer_profiles?.[0]?.hourly_rate || 0}/hr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full">
                  <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
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
