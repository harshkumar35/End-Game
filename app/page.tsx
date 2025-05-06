import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FluidBackground } from "@/components/ui/fluid-background"

export default function Home() {
  return (
    <>
      <FluidBackground />

      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="halo-container text-center relative z-10">
          {/* Hero glow effects */}
          <div className="halo-glow bg-halo-blue w-[500px] h-[500px] top-[-250px] left-[calc(50%-250px)]"></div>

          {/* Main heading with animation */}
          <h1 className="halo-heading animate-fade-in">
            LegalSathi<span className="text-halo-blue">.</span>
          </h1>

          <p className="halo-subheading mt-6 animate-fade-up">
            We connect you with the best legal professionals for your needs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link href="/lawyers">
              <Button className="halo-button halo-button-primary">Find Lawyers</Button>
            </Link>
            <Link href="/contact">
              <Button className="halo-button">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="halo-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card border border-white/5 rounded-lg p-6 transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="halo-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Expert Legal Professionals</h3>
              <p className="text-muted-foreground mb-6">
                Our platform connects you with verified and experienced lawyers across various specializations.
              </p>
              <ul className="space-y-2">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comprehensive Legal Solutions</h3>
              <p className="text-muted-foreground mb-6">
                From document generation to legal advice, we provide end-to-end solutions for all your legal needs.
              </p>
              <ul className="space-y-2">
                {features.slice(3, 6).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </>
  )
}

const services = [
  {
    title: "Legal Consultation",
    description: "Get expert advice from qualified lawyers on your legal matters.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
