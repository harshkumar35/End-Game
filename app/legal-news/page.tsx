"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsCard } from "@/components/news/news-card"
import { NewsFilters } from "@/components/news/news-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { NewsResponse } from "@/lib/services/news-service"

export default function LegalNewsPage() {
  const [news, setNews] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (category) params.append("category", category)
        if (query) params.append("query", query)
        params.append("page", page.toString())
        params.append("pageSize", "10")

        const response = await fetch(`/api/news?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const data = await response.json()
        console.log("News data:", data) // For debugging
        setNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Failed to load legal news. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [category, query, page])

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory === "all" ? undefined : newCategory)
    setPage(1) // Reset to first page
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery || undefined)
    setPage(1) // Reset to first page
  }

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Legal News</h1>
          <p className="text-muted-foreground">Stay updated with the latest legal developments and news</p>
        </div>

        <NewsFilters
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          selectedCategory={category || "all"}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : news?.results?.length ? (
        <div className="grid grid-cols-1 gap-6">
          {news.results.map((item) => (
            <NewsCard key={item.article_id} news={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No News Found</CardTitle>
            <CardDescription>
              {query || category
                ? "Try adjusting your filters or search query."
                : "There are currently no legal news articles available."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
