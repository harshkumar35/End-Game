import type { NewsItem } from "@/lib/types/news"

export interface NewsResponse {
  status: string
  totalResults: number
  results: NewsItem[]
  nextPage?: string
}

export async function fetchNews(category?: string, query?: string, page = 1, pageSize = 10): Promise<NewsResponse> {
  try {
    // Create base URL - note the correct API key format
    const baseUrl = "https://newsdata.io/api/1/news?apikey=pub_8499121c4468c0323c93c3b29a7c8ce7596c5"

    // Add parameters
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (query) params.append("q", query)
    params.append("country", "in")
    params.append("language", "en")

    // Handle pagination
    if (page > 1 && pageSize) {
      params.append("page", page.toString())
      params.append("size", pageSize.toString())
    }

    // Construct the URL
    const url = `${baseUrl}&${params.toString()}`
    console.log("Fetching news from:", url)

    // Fetch the data
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`News API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the response to match our interface
    return {
      status: data.status,
      totalResults: data.totalResults || 0,
      results: data.results || [],
      nextPage: data.nextPage,
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return empty results on error
    return {
      status: "error",
      totalResults: 0,
      results: [],
    }
  }
}

// Keep the newer functions for backward compatibility
export async function fetchLegalNews(
  category = "",
  page = 1,
  query = "legal and justice",
): Promise<{ articles: NewsItem[]; nextPage: string | null }> {
  const response = await fetchNews(category, query, page)

  return {
    articles: response.results || [],
    nextPage: response.nextPage,
  }
}

export async function fetchNewsByCategory(category: string): Promise<NewsItem[]> {
  try {
    const { articles } = await fetchLegalNews(category)
    return articles
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error)
    return []
  }
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  try {
    const { articles } = await fetchLegalNews("", 1, query)
    return articles
  } catch (error) {
    console.error(`Error searching news for "${query}":`, error)
    return []
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
      article_id: "1",
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
      article_id: "2",
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
      article_id: "3",
    },
  ]
}
