import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Portfolio Builder - Create Your Professional Portfolio in Minutes",
    template: "%s | Portfolio Builder",
  },
  description:
    "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
  keywords: ["portfolio", "resume", "AI", "website builder", "professional", "templates"],
  authors: [{ name: "Portfolio Builder" }],
  creator: "Portfolio Builder",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Portfolio Builder - Create Your Professional Portfolio in Minutes",
    description:
      "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
    siteName: "Portfolio Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Builder - Create Your Professional Portfolio in Minutes",
    description:
      "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
