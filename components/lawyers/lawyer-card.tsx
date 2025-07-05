"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Star, MessageCircle } from "lucide-react"
import Link from "next/link"

interface LawyerCardProps {
  lawyer: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    lawyer_profiles?: Array<{
      specialization: string
      experience_years: number
      hourly_rate: number
      bio: string
      is_available: boolean
      location?: string
      rating?: number
    }>
  }
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const profile = lawyer.lawyer_profiles?.[0]
  const initials = lawyer.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10">
            <AvatarImage src={lawyer.avatar_url || "/placeholder.svg"} alt={lawyer.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {lawyer.full_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{lawyer.email}</p>
            {profile?.specialization && (
              <Badge variant="secondary" className="mt-2">
                {profile.specialization}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {profile?.bio && <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {profile?.experience_years !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{profile.experience_years} years exp.</span>
            </div>
          )}

          {profile?.hourly_rate !== undefined && profile.hourly_rate > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>₹{profile.hourly_rate}/hr</span>
            </div>
          )}

          {profile?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{profile.location}</span>
            </div>
          )}

          {profile?.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{profile.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${profile?.is_available ? "bg-green-500" : "bg-gray-400"}`} />
            <span className="text-xs text-muted-foreground">{profile?.is_available ? "Available" : "Busy"}</span>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/messages?lawyer=${lawyer.id}`}>
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
