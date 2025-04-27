import { toast } from "@/components/ui/use-toast"
import type { NewsArticle } from "@/lib/types/news"

export interface NewsResponse {
  status: string
  totalResults: number
  results: NewsArticle[]
  nextPage?: string
  message?: string // Added to handle error messages
}

export async function fetchLegalNews(language = "en", page?: string): Promise<NewsResponse> {
  try {
    const params = new URLSearchParams({
      language,
    })

    if (page) {
      params.append("page", page)
    }

    const response = await fetch(`/api/news?${params.toString()}`)
    const data = await response.json()

    // Check if the response contains an error message
    if (data.status === "error") {
      toast({
        title: "Error fetching news",
        description: data.message || "Failed to load the latest legal news. Please try again later.",
        variant: "destructive",
      })

      return {
        status: "error",
        message: data.message,
        totalResults: 0,
        results: [],
      }
    }

    return {
      status: data.status,
      totalResults: data.totalResults || 0,
      results: data.results || [],
      nextPage: data.nextPage,
    }
  } catch (error) {
    console.error("Error fetching legal news:", error)
    toast({
      title: "Error fetching news",
      description: "Failed to load the latest legal news. Please try again later.",
      variant: "destructive",
    })

    return {
      status: "error",
      message: "An unexpected error occurred",
      totalResults: 0,
      results: [],
    }
  }
}

export async function fetchNews(
  category?: string,
  query?: string,
  page = 1,
  pageSize = 10,
): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY

    if (!apiKey) {
      throw new Error("API key not found")
    }

    let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&page=${page}&size=${pageSize}`

    if (category) {
      url += `&category=${category}`
    }

    if (query) {
      url += `&q=${encodeURIComponent(query)}`
    }

    // Add law-related keywords to focus on legal news
    url += "&q=law OR legal OR court OR justice OR attorney OR lawyer"

    const response = await fetch(url, { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      articles: data.results || [],
      totalResults: data.totalResults || 0,
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    return { articles: [], totalResults: 0 }
  }
}
