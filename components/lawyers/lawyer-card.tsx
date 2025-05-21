"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LawyerCardProps {
  lawyer: any
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const lawyerProfile = lawyer.lawyer_profiles?.[0] || {}

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 bg-primary/20">
            <AvatarFallback>{lawyer.full_name?.charAt(0) || "L"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{lawyer.full_name || "Anonymous Lawyer"}</CardTitle>
            <CardDescription>{lawyerProfile.specialization || "General Practice"}</CardDescription>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              <span className="ml-2 text-sm text-muted-foreground">(12 reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {lawyerProfile.bio ||
              "Experienced legal professional dedicated to helping clients navigate complex legal matters."}
          </p>
          <div className="flex items-center mt-2">
            {lawyerProfile.is_available ? (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Available for new cases
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 flex items-center gap-1"
              >
                <XCircle className="h-3 w-3" />
                Not taking new cases
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">Experience:</span>{" "}
              <span className="text-muted-foreground">{lawyerProfile.experience || 0} years</span>
            </div>
            <div>
              <span className="font-medium">Rate:</span>{" "}
              <span className="text-muted-foreground">₹{lawyerProfile.hourly_rate || 0}/hr</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full gradient-bg">
          <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
