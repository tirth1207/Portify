"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Share, ArrowLeft, Copy, ExternalLink } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PortfolioPage() {
  const [resume, setResume] = useState<any>(null)
  const [template, setTemplate] = useState("minimal")
  const [shareUrl, setShareUrl] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedResume = localStorage.getItem("parsedResume")
    const selected = localStorage.getItem("selectedTemplate")
    if (storedResume) setResume(JSON.parse(storedResume))
    if (selected) setTemplate(selected)
  }, [])

  const handleSave = (updatedData: any) => {
    setResume(updatedData)
    localStorage.setItem("parsedResume", JSON.stringify(updatedData))
  }

  const generateShareLink = async () => {
    setIsSharing(true)
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioData: resume,
          template: template,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShareUrl(result.shareUrl)
        toast({
          title: "Share link generated! 🚀",
          description: "Your portfolio is now ready to share with anyone.",
        })
      } else {
        throw new Error(result.error || "Failed to generate share link")
      }
    } catch (error) {
      console.error("Error generating share link:", error)
      toast({
        title: "Error generating share link",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Copied! 📋",
      description: "Share link copied to clipboard",
    })
  }

  const openInNewTab = () => {
    window.open(shareUrl, "_blank")
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
    const props = { data: resume, editMode: false, onSave: handleSave }

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
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Portfolio</DialogTitle>
                <DialogDescription>
                  Generate a unique link to share your portfolio with anyone, anywhere.
                </DialogDescription>
              </DialogHeader>

              {shareUrl ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Your portfolio link:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-white dark:bg-gray-900 p-2 rounded border break-all">
                        {shareUrl}
                      </code>
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={openInNewTab} className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" onClick={copyToClipboard} className="flex-1 bg-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      ✨ This link works anywhere! Share it via email, social media, or messaging apps. Anyone with the
                      link can view your portfolio.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Share className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a shareable link that works on any device
                    </p>
                  </div>
                  <Button onClick={generateShareLink} disabled={isSharing} className="w-full">
                    {isSharing ? "Generating..." : "Generate Share Link"}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <DeployButton portfolioData={resume} selectedTemplate={template} />
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="pt-20">{renderTemplate()}</div>
    </div>
  )
}
