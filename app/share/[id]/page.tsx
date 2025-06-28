"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import PortfolioTemplate from "@/components/templates/PortfolioTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import CreativeTemplate from "@/components/templates/CreativeTemplate"
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate"
import MinimalTemplate from "@/components/templates/MinimalTemplate"
import TechTemplate from "@/components/templates/TechTemplate"
import ArtisticTemplate from "@/components/templates/ArtisticTemplate"
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate"

export default function SharedPortfolioPage() {
  const params = useParams()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [template, setTemplate] = useState("minimal")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const portfolioId = params.id as string

    if (portfolioId) {
      try {
        // In a real app, you'd fetch from your database
        // For now, we'll get from localStorage
        const storedData = localStorage.getItem(`shared_portfolio_${portfolioId}`)

        if (storedData) {
          const parsed = JSON.parse(storedData)
          setPortfolioData(parsed.data)
          setTemplate(parsed.template)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The portfolio you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Your Own Portfolio
          </a>
        </div>
      </div>
    )
  }

  const renderTemplate = () => {
    // No edit mode and no onSave for shared portfolios
    const props = { data: portfolioData, editMode: false }

    switch (template) {
      case "minimal":
        return <MinimalTemplate {...props} />
      case "modern":
        return <ModernTemplate {...props} />
      case "creative":
        return <CreativeTemplate {...props} />
      case "professional":
        return <ProfessionalTemplate {...props} />
      case "tech":
        return <TechTemplate {...props} />
      case "artistic":
        return <ArtisticTemplate {...props} />
      case "executive":
        return <ExecutiveTemplate {...props} />
      default:
        return <PortfolioTemplate {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* No navigation bar - just the portfolio content */}
      {renderTemplate()}

      {/* Subtle branding footer */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          className="inline-flex items-center px-3 py-2 bg-black/80 text-white text-xs rounded-full hover:bg-black transition-colors backdrop-blur-sm"
        >
          Create your own portfolio
        </a>
      </div>
    </div>
  )
}
