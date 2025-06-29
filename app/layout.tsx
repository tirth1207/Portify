import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Portify - Create Your Professional Portfolio in Minutes",
    template: "%s | Portfolio Builder",
  },
  description:
    "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
  keywords: ["portfolio", "resume", "AI", "website builder", "professional", "templates"],
  authors: [{ name: "Tirth Rathod", url: "https://portify.co.in" }],
  creator: "Tirth Rathod",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portify.co.in",
    title: "Portfolio Builder - Create Your Professional Portfolio in Minutes",
    description:
      "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
    siteName: "Portfolio Builder",
    images: [
      {
        url: "https://portify.co.in/og-image.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Portfolio Builder preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@portify_app", // Optional: add your Twitter handle
    title: "Portfolio Builder - Create Your Professional Portfolio in Minutes",
    description:
      "Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and launch your professional presence.",
    images: ["https://portify.co.in/og-image.png"], // Same image as OG
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://portify.co.in"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://portify.co.in" />
      </head>
      <body className={cn("w-full min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            {children}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
