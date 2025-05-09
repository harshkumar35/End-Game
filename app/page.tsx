import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { AiSearchBar } from "@/components/hero/ai-search-bar"
import { AnimatedServices } from "@/components/home/animated-services"

export default function Home() {
  return (
    <main>
      <CosmicBackground />

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Hero glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">
            LegalSathi<span className="text-blue-400">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10">
            We connect you with the best legal professionals for your needs.
          </p>

          {/* AI Search Bar */}
          <AiSearchBar />

          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <Link href="/lawyers">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white border-none h-12 px-8 rounded-full text-base"
              >
                Find Lawyers
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-full text-base"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add the animated services section */}
      <AnimatedServices />

      <section className="relative py-24 z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link href={service.link} key={index} className="group block">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-4px] group h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                  <p className="text-white/70">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 z-10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Expert Legal Professionals</h3>
              <p className="text-white/70 mb-6">
                Our platform connects you with verified and experienced lawyers across various specializations.
              </p>
              <ul className="space-y-2">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Comprehensive Legal Solutions</h3>
              <p className="text-white/70 mb-6">
                From document generation to legal advice, we provide end-to-end solutions for all your legal needs.
              </p>
              <ul className="space-y-2">
                {features.slice(3, 6).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const services = [
  {
    title: "Legal Consultation",
    description: "Get expert advice from qualified lawyers on your legal matters.",
    link: "/lawyers",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    title: "Document Generation",
    description: "Create legally valid documents with our automated templates.",
    link: "/dashboard/document-generator",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Legal Community",
    description: "Connect with others facing similar legal challenges and share experiences.",
    link: "/posts",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857"
        />
      </svg>
    ),
  },
]

const features = [
  "Verified lawyer profiles with credentials",
  "Specialized legal expertise across domains",
  "Transparent fee structures",
  "AI-powered document generation",
  "Community support and resources",
  "Secure and confidential consultations",
]
