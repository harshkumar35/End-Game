import type { NewsApiResponse, NewsItem } from "@/lib/types/news"

const API_KEY = process.env.NEWSDATA_API_KEY
const BASE_URL = "https://newsdata.io/api/1/news"

// Cache for API responses
const cache = new Map<string, { data: NewsApiResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function fetchNews(category?: string, query?: string, page = 1, pageSize = 10): Promise<NewsApiResponse> {
  try {
    // Build cache key
    const cacheKey = `${category || "all"}-${query || "none"}-${page}-${pageSize}`

    // Check cache
    const cachedData = cache.get(cacheKey)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return cachedData.data
    }

    // Build query params
    const params = new URLSearchParams({
      apikey: API_KEY || "",
      language: "en",
      size: pageSize.toString(),
    })

    if (category) {
      params.append("category", category)
    } else {
      params.append("category", "politics,crime,business")
    }

    if (query) {
      params.append("q", query)
    } else {
      params.append("q", "legal,law,court,justice,rights")
    }

    if (page > 1 && page <= 10) {
      // API only supports up to page 10
      params.append("page", page.toString())
    }

    // Fetch data
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error(`News API returned ${response.status}: ${response.statusText}`)
    }

    const data: NewsApiResponse = await response.json()

    // Cache the response
    cache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error("Error fetching news:", error)

    // Return fallback data
    return {
      status: "error",
      totalResults: 0,
      results: [],
      nextPage: null,
    }
  }
}

// Function to get fallback news items
export function getFallbackNews(): NewsItem[] {
  return [
    {
      title: "Supreme Court to Hear Major Case on Digital Privacy Rights",
      description:
        "The Supreme Court has agreed to hear a case that could redefine privacy rights in the digital age, focusing on government access to personal data stored by tech companies.",
      content:
        "In a move that could have far-reaching implications for digital privacy, the Supreme Court announced today that it will hear arguments in a case challenging the government's ability to access personal data stored by technology companies without a warrant. The case, which has been closely watched by privacy advocates and law enforcement agencies alike, centers on whether the Fourth Amendment's protections against unreasonable searches extend to digital information held by third parties. Legal experts suggest this could be the most significant privacy ruling in decades.",
      pubDate: new Date().toISOString(),
      image_url: null,
      source_id: "fallback",
      category: ["politics"],
      country: ["us"],
      language: "english",
    },
    {
      title: "New Legislation Aims to Reform Corporate Liability Laws",
      description:
        "Bipartisan legislation introduced in Congress seeks to update corporate liability standards, potentially making it easier to hold companies accountable for wrongdoing.",
      content:
        "A bipartisan group of lawmakers has introduced legislation that would significantly reform how corporations can be held liable for wrongdoing. The proposed bill would lower the threshold for proving corporate knowledge of illegal activities and increase penalties for repeat offenders. Business groups have expressed concern that the changes could lead to frivolous lawsuits, while consumer advocates argue the reforms are long overdue. The legislation comes after several high-profile cases where companies avoided significant penalties despite evidence of misconduct.",
      pubDate: new Date().toISOString(),
      image_url: null,
      source_id: "fallback",
      category: ["politics"],
      country: ["us"],
      language: "english",
    },
    {
      title: "Legal Aid Organizations Report Surge in Housing Cases",
      description:
        "Legal aid providers across the country are reporting a dramatic increase in housing-related cases as pandemic-era protections expire.",
      content:
        "Legal aid organizations nationwide are reporting an unprecedented surge in housing-related cases as pandemic-era eviction moratoriums and rental assistance programs come to an end. Many groups say they're now forced to turn away more than half of eligible clients due to resource constraints. 'We're seeing a perfect storm of rising rents, stagnant wages, and the end of emergency protections,' said Maria Rodriguez, director of a legal aid clinic in Chicago. Advocates are calling for increased funding and expanded right-to-counsel programs to address what some are calling an 'eviction crisis.'",
      pubDate: new Date().toISOString(),
      image_url: null,
      source_id: "fallback",
      category: ["business"],
      country: ["us"],
      language: "english",
    },
  ]
}
