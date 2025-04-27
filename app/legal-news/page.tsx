import { fetchNews } from "@/lib/services/news-service"
import { NewsCard } from "@/components/news/news-card"
import { NewsFilters } from "@/components/news/news-filters"

// Remove any imports from next/headers
// import { cookies } from 'next/headers'; // Remove this line if it exists

export default async function LegalNewsPage({
  searchParams,
}: {
  searchParams: { category?: string; query?: string; page?: string }
}) {
  const category = searchParams.category
  const query = searchParams.query
  const page = Number.parseInt(searchParams.page || "1")

  const { articles, totalResults } = await fetchNews(category, query, page)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Legal News</h1>

      <div className="mb-6">
        <NewsFilters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles && articles.length > 0 ? (
          articles.map((article, index) => <NewsCard key={index} article={article} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No news articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination would go here */}
    </div>
  )
}
