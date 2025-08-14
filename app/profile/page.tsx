import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ExperienceSection } from "@/components/profile/experience-section"
import { EducationSection } from "@/components/profile/education-section"
import { SkillsSection } from "@/components/profile/skills-section"

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/profile")
  }

  console.log("Loading profile for user:", session.user.id)

  // Get user data with better error handling
  let userData = null
  try {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (userError) {
      console.error("Error fetching user data:", userError)

      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || "User",
          role: session.user.user_metadata?.role || "client",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user:", createError)
        userData = {
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || "User",
          role: session.user.user_metadata?.role || "client",
        }
      } else {
        userData = newUser
      }
    } else {
      userData = user
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    userData = {
      id: session.user.id,
      email: session.user.email || "",
      full_name: session.user.user_metadata?.full_name || "User",
      role: session.user.user_metadata?.role || "client",
    }
  }

  console.log("User data loaded:", userData)

  // Get lawyer profile data if user is a lawyer
  let lawyerProfile = null
  if (userData?.role === "lawyer") {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("lawyer_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching lawyer profile:", profileError)

        // Create lawyer profile if doesn't exist
        const { data: newProfile, error: createProfileError } = await supabase
          .from("lawyer_profiles")
          .insert({
            user_id: session.user.id,
            specialization: "",
            experience: 0,
            hourly_rate: 0,
            bio: "",
            is_available: true,
            languages: "",
            education: "",
            certifications: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (createProfileError) {
          console.error("Error creating lawyer profile:", createProfileError)
          lawyerProfile = {
            user_id: session.user.id,
            specialization: "",
            experience: 0,
            hourly_rate: 0,
            bio: "",
            is_available: true,
            languages: "",
            education: "",
            certifications: "",
          }
        } else {
          lawyerProfile = newProfile
        }
      } else {
        lawyerProfile = profile
      }
    } catch (error) {
      console.error("Unexpected error fetching lawyer profile:", error)
      lawyerProfile = {
        user_id: session.user.id,
        specialization: "",
        experience: 0,
        hourly_rate: 0,
        bio: "",
        is_available: true,
        languages: "",
        education: "",
        certifications: "",
      }
    }
  }

  console.log("Lawyer profile loaded:", lawyerProfile)

  return (
    <div className="container py-10">
      <ProfileHeader user={userData} lawyerProfile={lawyerProfile} />

      <Tabs defaultValue="about" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <ProfileForm user={userData} lawyerProfile={lawyerProfile} />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <ExperienceSection userId={session.user.id} />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationSection userId={session.user.id} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsSection userId={session.user.id} />
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
            <p className="text-muted-foreground">Your community posts will appear here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
