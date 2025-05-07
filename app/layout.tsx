import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/lib/supabase/provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FluidBackground } from "@/components/ui/fluid-background"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "LegalSathi - Legal Services Platform",
  description: "Connect with lawyers, get legal advice, and access legal resources",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="botpress-webchat-script"
          src="https://cdn.botpress.cloud/webchat/v2.4/inject.js"
          strategy="afterInteractive"
        />
        <Script
          id="botpress-config-script"
          src="https://files.bpcontent.cloud/2025/05/04/06/20250504065744-37MIVWKZ.js"
          strategy="afterInteractive"
          onError={(e) => {
            console.error("Error loading Botpress script:", e)
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseProvider>
            <FluidBackground />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
