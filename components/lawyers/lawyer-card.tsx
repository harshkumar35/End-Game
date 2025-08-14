import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react"
import Link from "next/link"

interface LawyerCardProps {
  lawyer: {
    id: string
    full_name: string
    email: string
    phone?: string
    location?: string
    avatar_url?: string
    profile: {
      specialization: string
      experience: number
      hourly_rate?: number
      bio?: string
      is_available: boolean
      languages?: string[]
    }
  }
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const { profile } = lawyer

  const initials = lawyer.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={lawyer.avatar_url || ""} alt={lawyer.full_name} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/lawyers/${lawyer.id}`} className="hover:underline">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {lawyer.full_name}
              </h3>
            </Link>
            <Badge variant="secondary" className="mt-1">
              {profile.specialization}
            </Badge>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${profile.is_available ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-muted-foreground">{profile.is_available ? "Available" : "Busy"}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Experience and Rate */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {profile.experience} years exp.
          </div>
          {profile.hourly_rate && (
            <div className="flex items-center text-sm font-medium">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />₹{profile.hourly_rate}/hr
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>}

        {/* Location */}
        {lawyer.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {lawyer.location}
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.languages.slice(0, 3).map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
            {profile.languages.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{profile.languages.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
        </Button>
        {lawyer.phone && (
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${lawyer.phone}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        )}
        <Button asChild size="sm" variant="outline">
          <a href={`mailto:${lawyer.email}`}>
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
