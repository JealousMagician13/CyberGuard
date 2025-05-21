import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import { Shield } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cybersecurity Detection Tools",
  description: "Detect fake news, phishing links, and malware threats",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <header className="border-b p-4 flex items-center md:hidden">
                <MobileNav />
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h1 className="font-bold">CyberGuard</h1>
                </div>
              </header>
              <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
