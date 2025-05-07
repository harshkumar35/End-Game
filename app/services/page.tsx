import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Scale, FileText, Users, MessageSquare, Newspaper } from "lucide-react"

export const metadata: Metadata = {
  title: "Services - LegalSathi",
  description: "Explore our comprehensive legal services",
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Legal Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive legal solutions tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* AI Assistant */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <Bot className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>AI Legal Assistant</CardTitle>
            <CardDescription>Get instant answers to your legal questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our AI-powered legal assistant provides instant guidance on common legal issues, helps you understand
              legal terminology, and offers preliminary advice for your situation.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-assistant" className="w-full">
              <Button className="w-full">Try AI Assistant</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Find Lawyers */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <Users className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Find Lawyers</CardTitle>
            <CardDescription>Connect with qualified legal professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Browse our network of verified lawyers specializing in various legal domains. Filter by expertise,
              location, and ratings to find the perfect match for your legal needs.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/lawyers" className="w-full">
              <Button className="w-full">Find a Lawyer</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Legal Documents */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <FileText className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Document Generator</CardTitle>
            <CardDescription>Create legal documents with ease</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Generate professionally drafted legal documents tailored to your specific requirements. Our templates
              cover agreements, contracts, wills, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/document-generator" className="w-full">
              <Button className="w-full">Generate Documents</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Legal News */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <Newspaper className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Legal News</CardTitle>
            <CardDescription>Stay updated with the latest legal developments</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access curated legal news and updates relevant to your interests. Stay informed about changes in
              legislation, landmark cases, and legal trends.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/legal-news" className="w-full">
              <Button className="w-full">Read Legal News</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Community */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <MessageSquare className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Legal Community</CardTitle>
            <CardDescription>Join discussions on legal topics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Engage with our community of legal professionals and individuals seeking legal advice. Share experiences,
              ask questions, and participate in discussions.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/posts" className="w-full">
              <Button className="w-full">Join Community</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Case Management */}
        <Card className="bg-card border border-white/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <Scale className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Case Management</CardTitle>
            <CardDescription>Manage your legal cases efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Track your legal cases, store important documents, communicate with your lawyers, and stay updated on case
              progress all in one place.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/cases" className="w-full">
              <Button className="w-full">Manage Cases</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
