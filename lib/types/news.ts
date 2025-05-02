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
