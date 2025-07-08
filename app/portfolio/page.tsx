"use client"

import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Share, ArrowLeft, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PortfolioTemplate from "@/components/templates/PortfolioTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import CreativeTemplate from "@/components/templates/CreativeTemplate"
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate"
import DeployButton from "@/components/DeployButton"
import MinimalTemplate from "@/components/templates/MinimalTemplate"
import TechTemplate from "@/components/templates/TechTemplate"
import ArtisticTemplate from "@/components/templates/ArtisticTemplate"
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate"
import PremiumTemplate from "@/components/templates/PremiumTemplate"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProFeatureGate from "@/components/ProFeatureGate"
import { canUseProTemplates } from "@/lib/subscription-client"
import { supabase } from "@/lib/supabase"
import SimpleTemplate from "@/components/templates/SimpleTemplate"

function PortfolioContent() {
  const [resume, setResume] = useState<any>(null)
  const [template, setTemplate] = useState("minimal")
  const [shareUrl, setShareUrl] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [canUsePro, setCanUsePro] = useState(false)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Define which templates are pro templates
  const proTemplates = ["creative", "tech", "artistic", "executive", "premium"]

  useEffect(() => {
    const loadPortfolioData = async () => {
      const portfolioId = searchParams.get("id")
      
      // Check if user can use pro templates
      try {
        const canUseProResult = await canUseProTemplates()
        setCanUsePro(canUseProResult)
      } catch (error) {
        console.error("Error checking pro template access:", error)
        setCanUsePro(false)
      }
      
      if (portfolioId) {
        // Load from API
        try {
          // Get the current user's session token
          const { data: { session } } = await supabase.auth.getSession()
          const token = session?.access_token

          const response = await fetch(`/api/portfolio/${portfolioId}`, {
            headers: {
              ...(token && { "Authorization": `Bearer ${token}` })
            }
          })
          
          console.log("Debug - API response status:", response.status)
          
          if (!response.ok) {
            const errorData = await response.json()
            console.error("Debug - API error:", errorData)
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
          }
          
          const result = await response.json()
          console.log("Debug - API result:", result)
          
          if (result.success && result.data) {
            const portfolioData = {
              name: result.data.name,
              title: result.data.title,
              summary: result.data.summary,
              contact: result.data.contact || {},
              skills: result.data.skills || [],
              projects: result.data.projects || [],
              education: result.data.education || [],
              experience: result.data.experience || [],
              certifications: result.data.certifications || [],
              awards: result.data.awards || [],
              languages: result.data.languages || [],
              interests: result.data.interests || [],
              volunteer: result.data.volunteer || [],
              publications: result.data.publications || [],
              patents: result.data.patents || [],
            }
            setResume(portfolioData)
            setPortfolioId(portfolioId)
            
            // Set deployment status
            setIsDeployed(result.data.is_deployed || false)
            setDeploymentUrl(result.data.deployment_url || "")
            
            console.log("Debug - Portfolio loaded:", {
              id: portfolioId,
              isDeployed: result.data.is_deployed,
              deploymentUrl: result.data.deployment_url,
              template: result.data.template
            })
            
            // Check if the template is a pro template and user doesn't have access
            const selectedTemplate = result.data.template || "minimal"
            // if (proTemplates.includes(selectedTemplate) && !canUsePro) {
            //   toast({
            //     title: "Pro Template Access Denied",
            //     description: "You need to upgrade to Standard or Pro plan to use this template.",
            //     variant: "destructive",
            //   })
            //   // Redirect to onboarding to choose a different template
            //   window.location.href = "/onboarding"
            //   return
            // }
            setTemplate(selectedTemplate)
          } else {
            throw new Error("Failed to load portfolio")
          }
        } catch (error) {
          console.error("Error loading portfolio:", error)
          toast({
            title: "Error loading portfolio",
            description: "Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // Load from localStorage (existing behavior)
        const storedResume = localStorage.getItem("parsedResume")
        const selected = localStorage.getItem("selectedTemplate")
        if (storedResume) setResume(JSON.parse(storedResume))
        if (selected) {
          // Check if the selected template is a pro template and user doesn't have access
          if (proTemplates.includes(selected) && canUsePro) {
            toast({
              title: "Pro Template Access Denied",
              description: "You need to upgrade to Standard or Pro plan to use this template.",
              variant: "destructive",
            })
            // Redirect to onboarding to choose a different template
            window.location.href = "/onboarding"
            return
          }
          setTemplate(selected)
        }
      }
      
      setLoading(false)
    }

    loadPortfolioData()
  }, [searchParams, toast])

  const handleSave = (updatedData: any) => {
    setResume(updatedData)
    localStorage.setItem("parsedResume", JSON.stringify(updatedData))
  }

  const generateShareLink = async () => {
    setIsSharing(true)
    try {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
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

  if (loading || !resume) {
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
      case "simple":
        return <SimpleTemplate {...props} />
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
      {/* Floating Action Bar */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center bg-white dark:bg-slate-800 rounded-full shadow-lg border px-6 py-3">
        <Link href={searchParams.get("id") ? "/dashboard" : "/onboarding"}>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Portfolio</DialogTitle>
                <DialogDescription>
                  Generate a shareable link that works on any device
                </DialogDescription>
              </DialogHeader>
              {shareUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <Button onClick={copyToClipboard} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={openInNewTab} className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(false)}
                    >
                      Close
                    </Button>
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

          <ProFeatureGate feature="deploy">
            <DeployButton 
              portfolioData={resume} 
              selectedTemplate={template} 
              portfolioId={portfolioId || undefined}
              isDeployed={isDeployed}
              deploymentUrl={deploymentUrl}
            />
          </ProFeatureGate>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="pt-20">{renderTemplate()}</div>
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PortfolioContent />
    </Suspense>
  )
}
