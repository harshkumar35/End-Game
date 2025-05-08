"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Scale, FileText, Users, MessageSquare, BookOpen, Shield } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

const ServiceCard = ({ icon, title, description, delay }: ServiceCardProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay * 0.1,
            ease: [0.25, 0.1, 0.25, 1.0],
          },
        },
      }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative bg-blue-950/30 border border-blue-800/30 p-6 rounded-xl backdrop-blur-sm hover:border-blue-700/50 transition-all duration-300 cosmic-glow">
        <div className="text-blue-400 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-blue-200/70">{description}</p>
      </div>
    </motion.div>
  )
}

export function AnimatedServices() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const services = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Legal Consultation",
      description:
        "Connect with experienced lawyers for personalized legal advice tailored to your specific situation.",
      delay: 0,
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Generation",
      description:
        "Create legally binding documents with our AI-powered generator, saving you time and ensuring accuracy.",
      delay: 1,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Lawyer Matching",
      description:
        "Find the perfect lawyer for your case with our advanced matching algorithm based on expertise and experience.",
      delay: 2,
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Legal AI Assistant",
      description:
        "Get instant answers to your legal questions with our advanced AI assistant trained on legal precedents.",
      delay: 3,
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Legal Resources",
      description:
        "Access our comprehensive library of legal resources, templates, and guides for various legal matters.",
      delay: 4,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Case Management",
      description:
        "Efficiently manage your legal cases with our secure platform, tracking progress and storing documents.",
      delay: 5,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="halo-container">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1.0],
              },
            },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">
            Explore our comprehensive suite of legal services designed to make legal assistance accessible, efficient,
            and tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={service.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
