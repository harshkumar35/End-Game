"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import Link from "next/link"
import { Scale, FileText, Users, MessageSquare, Newspaper, Bot } from "lucide-react"

export function AnimatedServices() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section ref={ref} className="relative py-24 z-10">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
        >
          Comprehensive Legal Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <Link href={service.link} key={service.title}>
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 h-full group hover:bg-white/10 transition-all duration-300"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1.0],
                    },
                  },
                }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                    {service.icon}
                  </div>
                  <div className="absolute -inset-3 bg-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-white/70 mb-4">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300"
                    >
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
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const services = [
  {
    title: "AI Legal Assistant",
    description: "Get instant answers to your legal questions with our AI-powered assistant.",
    link: "/ai-assistant",
    icon: <Bot className="w-8 h-8 text-blue-400" />,
    features: [
      "24/7 availability for legal guidance",
      "Instant responses to common legal questions",
      "Legal document explanation",
      "Preliminary case assessment",
    ],
  },
  {
    title: "Find Lawyers",
    description: "Connect with qualified legal professionals specialized in your specific needs.",
    link: "/lawyers",
    icon: <Users className="w-8 h-8 text-blue-400" />,
    features: [
      "Verified lawyer profiles",
      "Filter by specialization and location",
      "Direct messaging with lawyers",
      "Transparent fee structures",
    ],
  },
  {
    title: "Document Generator",
    description: "Create legally valid documents tailored to your specific requirements.",
    link: "/dashboard/document-generator",
    icon: <FileText className="w-8 h-8 text-blue-400" />,
    features: [
      "Multiple document templates",
      "Customizable to your needs",
      "Legally compliant formats",
      "Easy download and sharing",
    ],
  },
  {
    title: "Case Management",
    description: "Track and manage your legal cases efficiently in one place.",
    link: "/dashboard/cases",
    icon: <Scale className="w-8 h-8 text-blue-400" />,
    features: ["Case progress tracking", "Document organization", "Communication history", "Important date reminders"],
  },
  {
    title: "Legal Community",
    description: "Join discussions and share experiences with others facing similar legal challenges.",
    link: "/posts",
    icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
    features: ["Discussion forums by topic", "Expert contributions", "Question and answer section", "Resource sharing"],
  },
  {
    title: "Legal News",
    description: "Stay updated with the latest legal developments and changes in legislation.",
    link: "/legal-news",
    icon: <Newspaper className="w-8 h-8 text-blue-400" />,
    features: [
      "Daily legal news updates",
      "Analysis of landmark cases",
      "Legislative changes alerts",
      "Industry-specific legal news",
    ],
  },
]
