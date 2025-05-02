import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/lib/supabase/provider"
import { RealtimeProvider } from "@/lib/context/real-time-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LegalSathi - Find the Right Lawyer for Your Case",
  description: "Connect with experienced lawyers for your legal needs. Post a case, find a lawyer, and get legal help.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RealtimeProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </RealtimeProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
