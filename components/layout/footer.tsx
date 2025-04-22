import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gradient-text">LegalSathi</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting clients with the right legal professionals for their needs. Find the perfect lawyer for your
              case.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link href="/cases" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Cases
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/legal-resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Legal Resources
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground mb-4">Get the latest updates and news directly to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input type="email" placeholder="Enter your email" className="w-full" />
              </div>
              <Button className="gradient-bg">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LegalSathi. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
