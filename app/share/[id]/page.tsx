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
import PremiumTemplate from "@/components/templates/PremiumTemplate"

export default function SharedPortfolioPage() {
  const params = useParams()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [template, setTemplate] = useState("minimal")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const portfolioId = params.id as string

    if (portfolioId) {
      fetchPortfolioData(portfolioId)
    }
  }, [params.id])

  const fetchPortfolioData = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/share?id=${portfolioId}`)
      const result = await response.json()

      if (result.success && result.data) {
        setPortfolioData(result.data.portfolio_data)
        setTemplate(result.data.template)
      } else {
        // Check if it's an expired error
        if (result.error && result.error.includes("expired")) {
          setExpired(true)
        } else {
          setError(true)
        }
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Link Expired</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              This portfolio link has expired. Shared portfolio links are valid for 24 hours from the time they were created.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
          >
            Create Your Own Portfolio
          </a>
        </div>
      </div>
    )
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The portfolio you're looking for doesn't exist or the link may be incorrect.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
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
      case "premium":
        return <PremiumTemplate {...props} />
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
          className="inline-flex items-center px-3 py-2 bg-black/80 hover:bg-black text-white text-xs rounded-full transition-colors backdrop-blur-sm shadow-lg"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          Create your own
        </a>
      </div>
    </div>
  )
}
