import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LawyerCard } from "@/components/lawyers/lawyer-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LawyersPage() {
  const supabase = createServerSupabaseClient()

  try {
    console.log("Fetching lawyers...")

    // First, get all users who are lawyers
    const { data: lawyerUsers, error: usersError } = await supabase
      .from("users")
      .select("*")
      .eq("role", "lawyer")
      .order("created_at", { ascending: false })

    if (usersError) {
      console.error("Error fetching lawyer users:", usersError)
      throw usersError
    }

    console.log("Found lawyer users:", lawyerUsers?.length || 0)

    // Then get all lawyer profiles
    const { data: lawyerProfiles, error: profilesError } = await supabase.from("lawyer_profiles").select("*")

    if (profilesError) {
      console.error("Error fetching lawyer profiles:", profilesError)
      // Don't throw error, just continue without profiles
    }

    console.log("Found lawyer profiles:", lawyerProfiles?.length || 0)

    // Combine users with their profiles
    const lawyers = (lawyerUsers || []).map((user) => {
      const profile = (lawyerProfiles || []).find((p) => p.user_id === user.id)
      return {
        ...user,
        profile: profile || {
          specialization: "General Practice",
          experience: 0,
          hourly_rate: 1000,
          bio: "I am a lawyer ready to help with your legal needs.",
          is_available: true,
          languages: ["English", "Hindi"],
        },
      }
    })

    console.log("Combined lawyers:", lawyers.length)

    return (
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Lawyers</h1>
          <p className="text-muted-foreground text-lg">Connect with experienced lawyers for your legal needs</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search lawyers..." className="pl-10" />
          </div>
        </div>

        {/* Results */}
        {lawyers.length > 0 ? (
          <>
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">Showing {lawyers.length} lawyers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No lawyers found</h3>
            <p className="text-muted-foreground mb-6">No lawyers have registered yet. Be the first to join!</p>
            <Button asChild>
              <a href="/register?role=lawyer">Register as a Lawyer</a>
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center bg-muted/50 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Are you a lawyer?</h2>
          <p className="text-muted-foreground mb-6">
            Join our platform and connect with clients who need your expertise
          </p>
          <Button asChild size="lg">
            <a href="/register?role=lawyer">Register as a Lawyer</a>
          </Button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p>Total lawyer users: {lawyerUsers?.length || 0}</p>
          <p>Total lawyer profiles: {lawyerProfiles?.length || 0}</p>
          <p>Combined lawyers: {lawyers.length}</p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in LawyersPage:", error)

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Find Lawyers</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Lawyers</h3>
            <p className="text-red-600 mb-4">Error: {error instanceof Error ? error.message : "Unknown error"}</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/lawyers">Try Again</a>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <a href="/register?role=lawyer">Register as a Lawyer</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
