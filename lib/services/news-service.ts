import { toast } from "@/components/ui/use-toast"

export interface NewsArticle {
  title: string
  description: string
  content: string
  pubDate: string
  image_url?: string
  source_id: string
  link: string
  creator?: string | string[]
  category?: string[]
  language: string
}

export interface NewsResponse {
  status: string
  totalResults: number
  results: NewsArticle[]
  nextPage?: string
  message?: string
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
      // Show toast with the error message
      toast({
        title: "Error fetching news",
        description: data.message || "Failed to load the latest legal news. Please try again later.",
        variant: "destructive",
      })

      return {
        status: "error",
        totalResults: 0,
        results: [],
        message: data.message,
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
      totalResults: 0,
      results: [],
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
