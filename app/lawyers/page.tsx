import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default async function LawyersPage() {
  const supabase = createServerSupabaseClient()

  // Fetch lawyers with their profiles
  const { data: lawyers } = await supabase
    .from("users")
    .select(`
      *,
      lawyer_profiles(*)
    `)
    .eq("role", "lawyer")
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find a Lawyer</h1>
        <p className="text-muted-foreground">Browse our network of qualified legal professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers?.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{lawyer.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>{lawyer.full_name}</CardTitle>
                  <CardDescription>{lawyer.lawyer_profiles?.[0]?.specialization || "General Practice"}</CardDescription>
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
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {lawyer.lawyer_profiles?.[0]?.bio ||
                  "Experienced legal professional dedicated to helping clients navigate complex legal matters."}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">Experience:</span>{" "}
                  <span className="text-muted-foreground">{lawyer.lawyer_profiles?.[0]?.experience || 0} years</span>
                </div>
                <div>
                  <span className="font-medium">Rate:</span>{" "}
                  <span className="text-muted-foreground">${lawyer.lawyer_profiles?.[0]?.hourly_rate || 0}/hr</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild className="w-full">
                <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
