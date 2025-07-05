import "@/lib/radix-polyfill"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BotpressChat } from "@/components/chat/botpress-chat"
import { BotpressProvider } from "@/components/chat/botpress-provider"
import { SupabaseProvider } from "@/lib/supabase/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LegalSathi - Connect with Legal Professionals",
  description: "Find and connect with the best legal professionals for your needs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.botpressWebChat = {
                init: {
                  botId: 'c6f2a8a9-c2c3-4c3d-9d9a-2c3d4c5d6e7f',
                  hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
                  messagingUrl: 'https://messaging.botpress.cloud',
                  clientId: 'c6f2a8a9-c2c3-4c3d-9d9a-2c3d4c5d6e7f',
                  botName: 'LegalSathi Assistant',
                  stylesheet: 'https://cdn.botpress.cloud/webchat/v1/standard.css',
                  useSessionStorage: true,
                  enableConversationDeletion: true
                }
              };
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            <BotpressProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <BotpressChat />
            </BotpressProvider>
          </SupabaseProvider>
        </ThemeProvider>
        <script src="https://cdn.botpress.cloud/webchat/v1/inject.js" defer></script>
      </body>
    </html>
  )
}
