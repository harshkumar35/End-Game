import type { NewsResponse } from "@/lib/types/news"

const API_KEY = "pub_778092f75ef1d8139a2255a4f61fca69cf027&q"
const BASE_URL = "https://newsdata.io/api/1/news"

export async function fetchNews(category?: string, query?: string, page = 1): Promise<NewsResponse> {
  try {
    // Build the query parameters
    const params = new URLSearchParams({
      apikey: API_KEY,
      country: "in",
      language: "en,hi",
      category: "business,crime,politics,technology,top",
    })

    // Add search query if provided
    if (query) {
      params.append("q", `${query} AND (legal OR justice OR law)`)
    } else {
      params.append("q", "legal AND justice")
    }

    // Add category filter if provided
    if (category && category !== "all") {
      params.set("category", category)
    }

    // Add pagination
    if (page > 1) {
      params.append("page", page.toString())
    }

    // Make the API request
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      articles: data.results || [],
      totalResults: data.totalResults || 0,
      nextPage: data.nextPage || null,
    }
  } catch (error) {
    console.error("Error fetching news:", error)

    // Return empty data on error
    return {
      articles: [],
      totalResults: 0,
      nextPage: null,
    }
  }
}
