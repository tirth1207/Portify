"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Share, ArrowLeft } from "lucide-react"
import Link from "next/link"
import PortfolioTemplate from "@/components/templates/PortfolioTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import CreativeTemplate from "@/components/templates/CreativeTemplate"
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate"
import DeployButton from "@/components/DeployButton"
import MinimalTemplate from "@/components/templates/MinimalTemplate"
import TechTemplate from "@/components/templates/TechTemplate"
import ArtisticTemplate from "@/components/templates/ArtisticTemplate"
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate"

export default function PortfolioPage() {
  const [resume, setResume] = useState<any>(null)
  const [template, setTemplate] = useState("minimal")
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const storedResume = localStorage.getItem("parsedResume")
    const selected = localStorage.getItem("selectedTemplate")
    if (storedResume) setResume(JSON.parse(storedResume))
    if (selected) setTemplate(selected)
  }, [])

  const handleSave = (updatedData: any) => {
    setResume(updatedData)
    localStorage.setItem("parsedResume", JSON.stringify(updatedData))
    setEditMode(false)
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  const renderTemplate = () => {
    const props = { data: resume, editMode, onSave: handleSave }

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
      {/* Floating Action Bar */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center bg-white dark:bg-slate-800 rounded-full shadow-lg border px-6 py-3">
        <Link href="/onboarding">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant={editMode ? "default" : "outline"} size="sm" onClick={() => setEditMode(!editMode)}>
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Save" : "Edit"}
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <DeployButton portfolioData={resume} selectedTemplate={template} />
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="pt-20">{renderTemplate()}</div>
    </div>
  )
}
