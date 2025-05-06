import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { RealtimeProvider } from "@/lib/context/real-time-context"
import { SupabaseProvider } from "@/lib/supabase/provider"
import { BotpressChat } from "@/components/chat/botpress-chat"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "LegalSathi - Legal Services Platform",
  description: "Connect with lawyers, get legal advice, and manage your legal documents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        {/* Wrap everything in a single SupabaseProvider */}
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <RealtimeProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              {/* Add the Botpress chat component */}
              <BotpressChat />
            </RealtimeProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
