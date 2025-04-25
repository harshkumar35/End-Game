"use client"

import { useEffect, useState } from "react"
import { fetchLegalNews, type NewsArticle, type NewsResponse } from "@/lib/services/news-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Clock, User, Tag, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LegalNewsPage() {
  const [englishNews, setEnglishNews] = useState<NewsResponse | null>(null)
  const [hindiNews, setHindiNews] = useState<NewsResponse | null>(null)
  const [isLoadingEnglish, setIsLoadingEnglish] = useState(true)
  const [isLoadingHindi, setIsLoadingHindi] = useState(true)
  const [nextPageEnglish, setNextPageEnglish] = useState<string | undefined>()
  const [nextPageHindi, setNextPageHindi] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState("english")
  const [errorEnglish, setErrorEnglish] = useState<string | null>(null)
  const [errorHindi, setErrorHindi] = useState<string | null>(null)

  const loadEnglishNews = async (page?: string) => {
    setIsLoadingEnglish(true)
    setErrorEnglish(null)
    try {
      const news = await fetchLegalNews("en", page)
      if (news.status === "error") {
        setErrorEnglish(news.message || "Failed to load news")
        return
      }

      if (page) {
        setEnglishNews((prev) => ({
          ...news,
          results: [...(prev?.results || []), ...news.results],
        }))
      } else {
        setEnglishNews(news)
      }
      setNextPageEnglish(news.nextPage)
    } catch (error) {
      setErrorEnglish("An unexpected error occurred")
      console.error("Error loading English news:", error)
    } finally {
      setIsLoadingEnglish(false)
    }
  }

  const loadHindiNews = async (page?: string) => {
    setIsLoadingHindi(true)
    setErrorHindi(null)
    try {
      const news = await fetchLegalNews("hi", page)
      if (news.status === "error") {
        setErrorHindi(news.message || "Failed to load news")
        return
      }

      if (page) {
        setHindiNews((prev) => ({
          ...news,
          results: [...(prev?.results || []), ...news.results],
        }))
      } else {
        setHindiNews(news)
      }
      setNextPageHindi(news.nextPage)
    } catch (error) {
      setErrorHindi("An unexpected error occurred")
      console.error("Error loading Hindi news:", error)
    } finally {
      setIsLoadingHindi(false)
    }
  }

  useEffect(() => {
    loadEnglishNews()
    loadHindiNews()
  }, [])

  const handleLoadMore = (language: string) => {
    if (language === "en" && nextPageEnglish) {
      loadEnglishNews(nextPageEnglish)
    } else if (language === "hi" && nextPageHindi) {
      loadHindiNews(nextPageHindi)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • h:mm a")
    } catch (e) {
      return dateString
    }
  }

  const renderArticle = (article: NewsArticle) => (
    <Card key={article.link} className="overflow-hidden hover:border-primary/20 transition-all">
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`${article.image_url ? "md:col-span-2" : "md:col-span-3"}`}>
          <CardHeader>
            <CardTitle className="text-xl line-clamp-2">
              <Link href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {article.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(article.pubDate)}</span>
              {article.source_id && (
                <>
                  <span className="mx-1">•</span>
                  <span>{article.source_id}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-muted-foreground">
              {article.description || article.content || "No description available."}
            </p>

            {article.creator && (
              <div className="flex items-center gap-1 mt-3 text-sm">
                <User className="h-3.5 w-3.5" />
                <span>By: {Array.isArray(article.creator) ? article.creator.join(", ") : article.creator}</span>
              </div>
            )}

            {article.category && article.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag className="h-3.5 w-3.5 mt-1" />
                {article.category.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        {article.image_url && (
          <div className="relative md:h-auto h-48">
            <div className="w-full h-full relative">
              <Image
                src={article.image_url || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover rounded-r-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}
      </div>

      <CardFooter className="border-t py-3 px-6">
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href={article.link} target="_blank" rel="noopener noreferrer">
            Read Full Article <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  const renderSkeleton = () =>
    Array(3)
      .fill(0)
      .map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Skeleton className="h-full w-full rounded-r-lg" />
            </div>
          </div>
        </Card>
      ))

  const renderErrorMessage = (error: string, language: string, retryFunction: () => void) => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error loading news</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={retryFunction}
          disabled={language === "en" ? isLoadingEnglish : isLoadingHindi}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${(language === "en" ? isLoadingEnglish : isLoadingHindi) ? "animate-spin" : ""}`}
          />
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Legal News</h1>
        <p className="text-muted-foreground">Stay updated with the latest legal developments and news</p>
      </div>

      <Tabs defaultValue="english" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="hindi">हिंदी</TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="space-y-6">
          {errorEnglish && renderErrorMessage(errorEnglish, "en", () => loadEnglishNews())}

          {isLoadingEnglish && !englishNews ? (
            renderSkeleton()
          ) : englishNews?.results && englishNews.results.length > 0 ? (
            <>
              <div className="space-y-6">{englishNews.results.map(renderArticle)}</div>

              {nextPageEnglish && (
                <div className="flex justify-center mt-8">
                  <Button onClick={() => handleLoadMore("en")} disabled={isLoadingEnglish} className="gradient-bg">
                    {isLoadingEnglish ? "Loading..." : "Load More"}
                    {!isLoadingEnglish && <ChevronRight className="ml-1 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </>
          ) : !errorEnglish ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No news available</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any legal news at the moment. Please check back later.
              </p>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="hindi" className="space-y-6">
          {errorHindi && renderErrorMessage(errorHindi, "hi", () => loadHindiNews())}

          {isLoadingHindi && !hindiNews ? (
            renderSkeleton()
          ) : hindiNews?.results && hindiNews.results.length > 0 ? (
            <>
              <div className="space-y-6">{hindiNews.results.map(renderArticle)}</div>

              {nextPageHindi && (
                <div className="flex justify-center mt-8">
                  <Button onClick={() => handleLoadMore("hi")} disabled={isLoadingHindi} className="gradient-bg">
                    {isLoadingHindi ? "लोड हो रहा है..." : "और देखें"}
                    {!isLoadingHindi && <ChevronRight className="ml-1 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </>
          ) : !errorHindi ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">कोई समाचार उपलब्ध नहीं है</h3>
              <p className="text-muted-foreground mb-6">हमें इस समय कोई कानूनी समाचार नहीं मिला। कृपया बाद में फिर से जांचें।</p>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}
