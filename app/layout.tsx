import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { RealtimeProvider } from "@/lib/context/real-time-context"
import { SupabaseProvider } from "@/lib/supabase/provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <RealtimeProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </RealtimeProvider>
          </ThemeProvider>
        </SupabaseProvider>

        {/* Botpress Chatbot Scripts */}
        <Script src="https://cdn.botpress.cloud/webchat/v2.4/inject.js" strategy="beforeInteractive" />
        <Script
          src="https://files.bpcontent.cloud/2025/05/04/06/20250504065744-37MIVWKZ.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
