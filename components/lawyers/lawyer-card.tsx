"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LawyerCardProps {
  lawyer: any
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 bg-primary/20">
            <AvatarFallback>{lawyer.full_name?.charAt(0) || "L"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{lawyer.full_name || "Anonymous Lawyer"}</CardTitle>
            <CardDescription>{lawyer.lawyer_profiles?.[0]?.specialization || "General Practice"}</CardDescription>
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
            {lawyer.lawyer_profiles?.[0]?.bio ||
              "Experienced legal professional dedicated to helping clients navigate complex legal matters."}
          </p>
          {lawyer.lawyer_profiles?.[0]?.headline && (
            <Badge variant="outline" className="bg-primary/10">
              {lawyer.lawyer_profiles?.[0]?.headline}
            </Badge>
          )}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">Experience:</span>{" "}
              <span className="text-muted-foreground">{lawyer.lawyer_profiles?.[0]?.experience || 0} years</span>
            </div>
            <div>
              <span className="font-medium">Rate:</span>{" "}
              <span className="text-muted-foreground">₹{lawyer.lawyer_profiles?.[0]?.hourly_rate || 0}/hr</span>
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
