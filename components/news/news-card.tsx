import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NewsItem } from "@/lib/services/news-service"

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  // Format date
  const formattedDate = news.pubDate
    ? new Date(news.pubDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl">{news.title}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              {formattedDate}
              {news.source_name && <span className="ml-4">{news.source_name}</span>}
            </CardDescription>
          </div>
          {news.image_url && (
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={news.image_url || "/placeholder.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle image loading errors
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{news.description || news.content || "No description available"}</p>
        <div className="flex flex-wrap gap-2">
          {news.category &&
            news.category.map((cat, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10">
                {cat}
              </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="gradient-bg w-full sm:w-auto">
          <Link href={news.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Read Full Article
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
