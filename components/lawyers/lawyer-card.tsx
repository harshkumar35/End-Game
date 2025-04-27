"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"

interface LawyerCardProps {
  lawyer: {
    id: string
    users: {
      full_name: string
      email: string
      avatar_url?: string
    }
    specialization?: string
    bio?: string
    headline?: string
    experience?: number
    hourly_rate?: number
  }
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={lawyer.users?.avatar_url || "/placeholder.svg"} alt={lawyer.users?.full_name} />
            <AvatarFallback>{lawyer.users?.full_name?.charAt(0) || "L"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{lawyer.users?.full_name}</CardTitle>
            <CardDescription>{lawyer.specialization || "General Practice"}</CardDescription>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              <span className="ml-2 text-xs text-muted-foreground">(12 reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {lawyer.bio ||
              "Experienced legal professional dedicated to helping clients navigate complex legal matters."}
          </p>
          {lawyer.headline && <Badge variant="outline">{lawyer.headline}</Badge>}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">Experience:</span>{" "}
              <span className="text-muted-foreground">{lawyer.experience || 0} years</span>
            </div>
            <div>
              <span className="font-medium">Rate:</span>{" "}
              <span className="text-muted-foreground">${lawyer.hourly_rate || 0}/hr</span>
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
  )
}
