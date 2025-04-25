import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEWSDATA_API_KEY
const BASE_URL = "https://newsdata.io/api/1/news"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "en"
    const page = searchParams.get("page") || ""

    const params = new URLSearchParams({
      apikey: API_KEY || "",
      language,
      category: "politics",
      q: "legal,law,justice,court,supreme court",
      size: "10",
    })

    if (page) {
      params.append("page", page)
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`)

    // Check if the response is ok before trying to parse JSON
    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        return NextResponse.json(
          {
            status: "error",
            message: "Rate limit exceeded. Please try again later.",
            totalResults: 0,
            results: [],
          },
          { status: 429 },
        )
      }

      // Handle other errors
      const errorText = await response.text()
      return NextResponse.json(
        {
          status: "error",
          message: `API error: ${response.status} ${response.statusText}`,
          details: errorText,
          totalResults: 0,
          results: [],
        },
        { status: response.status },
      )
    }

    // Only try to parse JSON if the response is ok
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching legal news:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        totalResults: 0,
        results: [],
      },
      { status: 500 },
    )
  }
}
