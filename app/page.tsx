import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroContainer } from "@/components/hero/hero-container"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Legal Solutions <span className="text-sky-500">Simplified</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Connect with expert lawyers, access legal resources, and get the legal assistance you need, all in one
                place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600">
                  <Link href="/lawyers">Find a Lawyer</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Join as a Lawyer</Link>
                </Button>
              </div>
            </div>
            <HeroContainer />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Legal Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Legal Assistance Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal Consultation</h3>
                <p className="text-gray-600 mb-4">
                  Get expert legal advice from qualified lawyers in various specializations.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/lawyers">Find Lawyers</Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Legal Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Get instant answers to common legal questions with our AI assistant.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/ai-assistant">Try AI Assistant</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Legal News Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal News</h3>
                <p className="text-gray-600 mb-4">Stay updated with the latest legal news and developments in India.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/legal-news">Read News</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal Community</h3>
                <p className="text-gray-600 mb-4">
                  Join discussions, share experiences, and learn from others in our community.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Document Templates Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Templates</h3>
                <p className="text-gray-600 mb-4">
                  Access and customize legal document templates for various purposes.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/document-generator">View Templates</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Case Posting Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Post a Case</h3>
                <p className="text-gray-600 mb-4">Post your legal case and receive proposals from qualified lawyers.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/post-case">Post a Case</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
