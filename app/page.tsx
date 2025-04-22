import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Shield, Users, Zap, Scale, Award, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const featuredLawyers = [
  {
    name: "Priya Sharma",
    specialization: "Corporate Law",
    experience: 8,
    rating: 4.9,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Rahul Verma",
    specialization: "Criminal Law",
    experience: 12,
    rating: 4.7,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Ananya Patel",
    specialization: "Family Law",
    experience: 6,
    rating: 4.8,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">
                  The Legal Platform for Modern Businesses
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  Find the <span className="gradient-text">Perfect Lawyer</span> for Your Legal Needs
                </h1>
                <p className="text-xl text-muted-foreground">
                  Connect with experienced lawyers specializing in various legal fields. Get expert legal advice and
                  representation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-bg" asChild>
                  <Link href="/register?role=client">Post a Case</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/lawyers">Find a Lawyer</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <span className="font-medium text-foreground">500+</span> lawyers joined in the last 30 days
                </div>
              </div>
            </div>
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              <div className="absolute inset-0 grid-pattern"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="p-8 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg max-w-md">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">John Smith</h3>
                      <p className="text-sm text-muted-foreground">Corporate Lawyer • 8 years exp.</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    "LegalSathi helped me connect with clients that perfectly match my expertise. The platform is
                    intuitive and the client management tools are excellent."
                  </p>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to find legal help</h2>
            <p className="text-xl text-muted-foreground">
              Our platform provides all the tools you need to connect with the right legal professional for your
              specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                <p className="text-muted-foreground">
                  All lawyers on our platform are verified and have their credentials checked for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Communication</h3>
                <p className="text-muted-foreground">
                  Our platform ensures all communications and document sharing are secure and encrypted.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  Clear pricing with no hidden fees. Pay only for the services you need.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Matching</h3>
                <p className="text-muted-foreground">
                  Our intelligent matching system connects you with the right lawyers for your case quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  We maintain high standards for all lawyers on our platform through reviews and ratings.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-primary/10 card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Case Management</h3>
                <p className="text-muted-foreground">
                  Manage all your legal cases in one place with our intuitive dashboard and tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How LegalSathi Works</h2>
            <p className="text-xl text-muted-foreground">
              A simple process to connect you with the right legal professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="gradient-border">
                <div className="bg-background p-8 rounded-lg">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Post Your Case</h3>
                  <p className="text-muted-foreground">
                    Describe your legal issue, set your budget, and specify your requirements.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-primary">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            <div className="relative">
              <div className="gradient-border">
                <div className="bg-background p-8 rounded-lg">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Receive Proposals</h3>
                  <p className="text-muted-foreground">
                    Qualified lawyers will send you proposals tailored to your specific needs.
                  </p>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-primary">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            <div>
              <div className="gradient-border">
                <div className="bg-background p-8 rounded-lg">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hire & Collaborate</h3>
                  <p className="text-muted-foreground">
                    Choose the best lawyer and work together through our secure platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="gradient-bg" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">Top Professionals</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Lawyers</h2>
            <p className="text-xl text-muted-foreground">
              Meet some of our top-rated legal professionals ready to help you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLawyers.map((lawyer, index) => (
              <Card key={index} className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={lawyer.avatar || "/placeholder.svg"} alt={lawyer.name} />
                        <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                        <Badge variant="secondary">{lawyer.specialization}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.round(lawyer.rating) ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{lawyer.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{lawyer.experience} years of experience</p>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/lawyers/${index}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/lawyers">View All Lawyers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="absolute inset-0 grid-pattern"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of clients and lawyers who are already using LegalSathi to solve their legal challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="gradient-bg" asChild>
                <Link href="/register?role=client">Join as a Client</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register?role=lawyer">Join as a Lawyer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
