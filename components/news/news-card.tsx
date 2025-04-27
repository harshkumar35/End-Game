import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/lib/types/news"

// Remove any imports from next/headers
// import { cookies } from 'next/headers'; // Remove this line if it exists

export function NewsCard({ article }: { article: NewsArticle }) {
  const formattedDate = new Date(article.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {article.imageUrl && (
          <div className="mb-4 aspect-video relative overflow-hidden rounded-md">
            <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {article.description || "No description available."}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
            Read More <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
