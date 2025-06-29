"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Edit, Trash2, Crown, AlertCircle, Eye, Share, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import PlanStatus from "@/components/PlanStatus"
import { canCreatePortfolio } from "@/lib/subscription-client"
import UpgradeModal from "@/components/UpgradeModal"
import Navigation from "@/components/Navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Portfolio {
  id: string
  name: string
  title: string
  template: string
  is_deployed: boolean
  deployment_url: string | null
  subdomain: string | null
  created_at: string
  updated_at: string
  summary: string
  contact: Record<string, any>
  skills: string[]
  projects: any[]
  education: any[]
  experience: any[]
  certifications: any[]
  awards: any[]
  languages: string[]
  interests: string[]
  volunteer: any[]
  publications: any[]
  patents: any[]
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [shareUrl, setShareUrl] = useState("")
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPortfolios(data || [])
    } catch (error) {
      console.error("Error fetching portfolios:", error)
      toast({
        title: "Error loading portfolios",
        description: "Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePortfolio = async () => {
    try {
      const result = await canCreatePortfolio()
      
      if (!result.canCreate) {
        if (result.reason?.includes("limit")) {
          setShowUpgradeModal(true)
        } else {
          toast({
            title: "Cannot create portfolio",
            description: result.reason,
            variant: "destructive",
          })
        }
        return
      }

      // Redirect to upload page to create new portfolio
      window.location.href = "/upload"
    } catch (error) {
      console.error("Error checking portfolio creation:", error)
      toast({
        title: "Error",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", portfolioId)

      if (error) throw error

      toast({
        title: "Portfolio deleted",
        description: "Your portfolio has been successfully deleted.",
      })

      fetchPortfolios()
    } catch (error) {
      console.error("Error deleting portfolio:", error)
      toast({
        title: "Error deleting portfolio",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSharePortfolio = async (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setShareDialogOpen(true)
    setShareUrl("")
    setIsGeneratingShare(true)

    try {
      // Get portfolio data from database
      const { data: portfolioData, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolio.id)
        .single()

      if (error) throw error

      // Generate share link with all fields
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioData: {
            name: portfolioData.name,
            title: portfolioData.title,
            summary: portfolioData.summary,
            contact: portfolioData.contact || {},
            skills: portfolioData.skills || [],
            projects: portfolioData.projects || [],
            education: portfolioData.education || [],
            experience: portfolioData.experience || [],
            certifications: portfolioData.certifications || [],
            awards: portfolioData.awards || [],
            languages: portfolioData.languages || [],
            interests: portfolioData.interests || [],
            volunteer: portfolioData.volunteer || [],
            publications: portfolioData.publications || [],
            patents: portfolioData.patents || [],
          },
          template: portfolioData.template,
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
      setIsGeneratingShare(false)
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

  const viewPortfolio = (portfolio: Portfolio) => {
    // Store portfolio data in localStorage for the portfolio page
    const portfolioData = {
      name: portfolio.name,
      title: portfolio.title,
      summary: portfolio.summary || "",
      contact: portfolio.contact || {},
      skills: portfolio.skills || [],
      projects: portfolio.projects || [],
      education: portfolio.education || [],
      experience: portfolio.experience || [],
      certifications: portfolio.certifications || [],
      awards: portfolio.awards || [],
      languages: portfolio.languages || [],
      interests: portfolio.interests || [],
      volunteer: portfolio.volunteer || [],
      publications: portfolio.publications || [],
      patents: portfolio.patents || [],
    }
    localStorage.setItem("parsedResume", JSON.stringify(portfolioData))
    localStorage.setItem("selectedTemplate", portfolio.template)
    
    // Navigate to portfolio page
    window.open(`/portfolio?id=${portfolio.id}`, "_blank")
  }

  const getTemplateBadgeColor = (template: string) => {
    const colors: Record<string, string> = {
      minimal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      modern: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      creative: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      professional: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      tech: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      artistic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      executive: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    }
    return colors[template] || colors.minimal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Portfolios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and create your professional portfolios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Create Portfolio Card */}
            <Card className="mb-6 border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create New Portfolio
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload your resume and create a stunning portfolio
                </p>
                <Button onClick={handleCreatePortfolio} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Portfolio
                </Button>
              </CardContent>
            </Card>

            {/* Portfolios List */}
            {portfolios.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No portfolios yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first portfolio to get started
                  </p>
                  <Button onClick={handleCreatePortfolio}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Portfolio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">
                            {portfolio.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {portfolio.title}
                          </p>
                        </div>
                        <Badge className={getTemplateBadgeColor(portfolio.template)}>
                          {portfolio.template}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <div className="flex items-center gap-2">
                          {portfolio.is_deployed ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 dark:text-green-400">Deployed</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-500">Draft</span>
                            </>
                          )}
                        </div>
                      </div>

                      {portfolio.deployment_url && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">URL:</span>
                          <a
                            href={portfolio.deployment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline truncate ml-2"
                          >
                            {portfolio.subdomain || "Custom Domain"}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewPortfolio(portfolio)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSharePortfolio(portfolio)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        
                        <Link href={`/portfolio?id=${portfolio.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        {portfolio.deployment_url && (
                          <a
                            href={portfolio.deployment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PlanStatus onUpgradeClick={() => setShowUpgradeModal(true)} />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="portfolios"
        onUpgradeComplete={() => {
          setShowUpgradeModal(false)
          fetchPortfolios()
        }}
      />

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Portfolio</DialogTitle>
            <DialogDescription>
              Generate a unique link to share your portfolio with anyone, anywhere.
            </DialogDescription>
          </DialogHeader>

          {isGeneratingShare ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generating share link...</p>
            </div>
          ) : shareUrl ? (
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
                <Button variant="outline" onClick={copyToClipboard} className="flex-1">
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
              <Button onClick={() => selectedPortfolio && handleSharePortfolio(selectedPortfolio)} disabled={isGeneratingShare}>
                {isGeneratingShare ? "Generating..." : "Generate Share Link"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 