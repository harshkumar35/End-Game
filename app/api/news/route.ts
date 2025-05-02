import { NextResponse } from "next/server"
import { fetchNews } from "@/lib/services/news-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const query = searchParams.get("query") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    const news = await fetchNews(category, query, page, pageSize)

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error in news API route:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
