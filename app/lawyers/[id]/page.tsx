import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Clock, Star, Award, BookOpen, Languages, Scale, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

interface LawyerProfilePageProps {
  params: {
    id: string
  }
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const supabase = createServerSupabaseClient()

  try {
    // Get lawyer details
    const { data: lawyer, error: lawyerError } = await supabase
      .from("users")
      .select("*")
      .eq("id", params.id)
      .eq("role", "lawyer")
      .single()

    if (lawyerError || !lawyer) {
      console.error("Error fetching lawyer:", lawyerError)
      notFound()
    }

    // Get lawyer profile
    const { data: profile, error: profileError } = await supabase
      .from("lawyer_profiles")
      .select("*")
      .eq("user_id", params.id)
      .single()

    // If no profile found, create a default one
    const lawyerProfile = profile || {
      specialization: "General Practice",
      experience: 0,
      hourly_rate: 1000,
      bio: "I am a lawyer ready to help with your legal needs.",
      is_available: true,
      bar_registration_number: null,
      languages: ["English", "Hindi"],
      education: [],
      certifications: [],
      court_experience: [],
    }

    const initials = lawyer.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()

    return (
      <div className="container py-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                <AvatarImage src={lawyer.avatar_url || ""} alt={lawyer.full_name} />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{lawyer.full_name}</h1>
                    <Badge variant="default" className="text-base px-3 py-1 mb-2">
                      {lawyerProfile.specialization}
                    </Badge>
                    {lawyerProfile.bar_registration_number && (
                      <p className="text-sm text-muted-foreground">
                        Bar Registration: {lawyerProfile.bar_registration_number}
                      </p>
                    )}
                    <div className="flex items-center mt-3">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          lawyerProfile.is_available ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {lawyerProfile.is_available ? "Available for consultation" : "Currently busy"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <Button asChild>
                      <a href={`mailto:${lawyer.email}?subject=Legal Consultation Request`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Now
                      </a>
                    </Button>
                    {lawyer.phone && (
                      <Button variant="outline" asChild>
                        <a href={`tel:${lawyer.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">{lawyerProfile.bio}</p>
              </CardContent>
            </Card>

            {/* Education Section */}
            {lawyerProfile.education && lawyerProfile.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lawyerProfile.education.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Certifications Section */}
            {lawyerProfile.certifications && lawyerProfile.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certifications & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lawyerProfile.certifications.map((cert, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Court Experience Section */}
            {lawyerProfile.court_experience && lawyerProfile.court_experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-5 w-5 mr-2" />
                    Court Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lawyerProfile.court_experience.map((court, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {court}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <a href={`mailto:${lawyer.email}`} className="text-sm hover:underline">
                    {lawyer.email}
                  </a>
                </div>

                {lawyer.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                    <a href={`tel:${lawyer.phone}`} className="text-sm hover:underline">
                      {lawyer.phone}
                    </a>
                  </div>
                )}

                {lawyer.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{lawyer.location}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <a href={`mailto:${lawyer.email}?subject=Legal Consultation Request`}>Contact for Consultation</a>
                  </Button>
                  {lawyer.phone && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href={`tel:${lawyer.phone}`}>Call Now</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Experience</span>
                  </div>
                  <span className="text-sm font-medium">{lawyerProfile.experience} years</span>
                </div>

                {lawyerProfile.hourly_rate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Consultation Fee</span>
                    </div>
                    <span className="text-sm font-medium">₹{lawyerProfile.hourly_rate}/hour</span>
                  </div>
                )}

                {lawyerProfile.languages && lawyerProfile.languages.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lawyerProfile.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {new Date(lawyer.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in LawyerProfilePage:", error)
    notFound()
  }
}
