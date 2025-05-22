"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LawyerCardProps {
  lawyer: any
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const router = useRouter()
  const profile = lawyer.lawyer_profiles?.[0] || {}

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="overflow-hidden border border-white/10 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={lawyer.avatar_url || "/placeholder.svg?height=40&width=40"} alt={lawyer.full_name} />
            <AvatarFallback>{getInitials(lawyer.full_name || "User")}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{lawyer.full_name}</CardTitle>
            {profile.specialization && <CardDescription>{profile.specialization}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {profile.bio && <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>}

        <div className="space-y-2">
          {profile.experience_years && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Experience</span>
              <span>{profile.experience_years} years</span>
            </div>
          )}

          {profile.hourly_rate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Hourly Rate</span>
              <span>₹{profile.hourly_rate}</span>
            </div>
          )}

          {profile.location && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        {profile.languages && profile.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.languages.map((language: string) => (
              <Badge key={language} variant="outline" className="text-xs">
                {language}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" onClick={() => router.push(`/profile/${lawyer.id}`)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
