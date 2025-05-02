import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/3d/hero-scene"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Redesigned Hero Section */}
        <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"></div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/20 backdrop-blur-md animate-float-slow hidden lg:block"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-secondary/20 backdrop-blur-md animate-float hidden lg:block"></div>

          <div className="container mx-auto px-4 py-12 md:py-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-2">
                The Future of Legal Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                <span className="gradient-text">Legal Solutions</span> for the Digital Age
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
                Connect with experienced lawyers, get legal advice, and manage your documents all in one secure
                platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-all">
                    Get Started
                  </Button>
                </Link>
                <Link href="/lawyers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all"
                  >
                    Find a Lawyer
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-8">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/70">Lawyers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">10k+</p>
                  <p className="text-sm text-white/70">Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">98%</p>
                  <p className="text-sm text-white/70">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* 3D Hero Scene */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                <HeroScene />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/80 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Everything you need to navigate the legal landscape with confidence
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
              <div className="group p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-muted">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Find Expert Lawyers</h3>
                <p className="text-muted-foreground mb-4">
                  Browse through our network of experienced lawyers specializing in various legal domains.
                </p>
                <Link href="/lawyers" className="text-primary font-medium inline-flex items-center">
                  Explore Lawyers
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="group p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-muted">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Legal Document Generator</h3>
                <p className="text-muted-foreground mb-4">
                  Create professional legal documents with our easy-to-use document generator.
                </p>
                <Link
                  href="/dashboard/document-generator"
                  className="text-primary font-medium inline-flex items-center"
                >
                  Generate Documents
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="group p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-muted">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" x2="6" y1="2" y2="4" />
                    <line x1="10" x2="10" y1="2" y2="4" />
                    <line x1="14" x2="14" y1="2" y2="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Legal Community</h3>
                <p className="text-muted-foreground mb-4">
                  Join our community of legal professionals and clients to discuss legal matters.
                </p>
                <Link href="/posts" className="text-primary font-medium inline-flex items-center">
                  Join Community
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Simplify Your Legal Journey?
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground mt-4 mb-8">
                Join thousands of clients and lawyers who are already using LegalSathi to streamline their legal
                processes.
              </p>
              <div className="p-[1px] rounded-lg bg-gradient-to-r from-primary to-secondary inline-block">
                <Link href="/register">
                  <Button size="lg" className="bg-background hover:bg-background/90 text-foreground">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
