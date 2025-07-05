"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"

interface LawyerCardProps {
  lawyer: {
    id: string
    full_name: string
    email: string
    phone?: string
    specialization: string[]
    experience_years: number
    location: string
    rating: number
    total_reviews: number
    hourly_rate?: number
    avatar_url?: string
    is_available: boolean
    bio?: string
  }
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const initials = lawyer.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={lawyer.avatar_url || "/placeholder.svg"} alt={lawyer.full_name} />
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold truncate">{lawyer.full_name}</h3>
              <div className="flex items-center gap-1">
                {lawyer.is_available ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary">Busy</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{lawyer.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{lawyer.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({lawyer.total_reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specializations */}
        <div>
          <h4 className="text-sm font-medium mb-2">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialization.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {lawyer.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Experience and Rate */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{lawyer.experience_years} years exp.</span>
          </div>
          {lawyer.hourly_rate && <div className="font-medium">₹{lawyer.hourly_rate}/hour</div>}
        </div>

        {/* Bio */}
        {lawyer.bio && <p className="text-sm text-muted-foreground line-clamp-2">{lawyer.bio}</p>}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href={`tel:${lawyer.phone}`}>
              <Phone className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href={`mailto:${lawyer.email}`}>
              <Mail className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
