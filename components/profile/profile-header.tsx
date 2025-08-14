"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Briefcase, Clock, Star, CheckCircle, XCircle } from "lucide-react"

interface ProfileHeaderProps {
  user: any
  lawyerProfile: any
}

export function ProfileHeader({ user, lawyerProfile }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getSpecializationLabel = (spec: string) => {
    const labels: { [key: string]: string } = {
      family: "Family Law",
      criminal: "Criminal Defense",
      corporate: "Corporate Law",
      property: "Property Law",
      immigration: "Immigration Law",
      employment: "Employment Law",
      intellectual_property: "Intellectual Property",
      tax: "Tax Law",
      personal_injury: "Personal Injury",
      other: "Other",
    }
    return labels[spec] || spec
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.full_name} />
              <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                {getInitials(user?.full_name || "U")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{user?.full_name || "User"}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={user?.role === "lawyer" ? "default" : "secondary"}>
                  {user?.role === "lawyer" ? "Lawyer" : "Client"}
                </Badge>
                {user?.role === "lawyer" && lawyerProfile?.is_available !== undefined && (
                  <Badge variant={lawyerProfile.is_available ? "default" : "destructive"}>
                    {lawyerProfile.is_available ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex-1">
            <div className="grid gap-3">
              {user?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              )}

              {user?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}

              {user?.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}

              {/* Lawyer-specific information */}
              {user?.role === "lawyer" && lawyerProfile && (
                <>
                  {lawyerProfile.specialization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{getSpecializationLabel(lawyerProfile.specialization)}</span>
                    </div>
                  )}

                  {lawyerProfile.experience > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{lawyerProfile.experience} years experience</span>
                    </div>
                  )}

                  {lawyerProfile.hourly_rate > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>₹{lawyerProfile.hourly_rate}/hour</span>
                    </div>
                  )}

                  {lawyerProfile.languages && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Languages:</span>
                      <span>{lawyerProfile.languages}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bio */}
            {user?.role === "lawyer" && lawyerProfile?.bio && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{lawyerProfile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
