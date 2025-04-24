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

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

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
    }
  }
}
