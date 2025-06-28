"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ExternalLink, CheckCircle, X, Loader2, Globe, Calendar, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { canDeploySubdomain } from "@/lib/subscription-client"
import UpgradeModal from "./UpgradeModal"
import { supabase } from "@/lib/supabase"

interface DeployDialogProps {
  isOpen: boolean
  onClose: () => void
  portfolioData: any
  selectedTemplate: string
  onSuccess?: (result: DeploymentResult) => void
}

interface DeploymentResult {
  success: boolean
  url: string
  subdomain: string
  deployedAt: string
  template: string
  status: string
}

export default function DeployDialog({ 
  isOpen, 
  onClose, 
  portfolioData, 
  selectedTemplate,
  onSuccess
}: DeployDialogProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { toast } = useToast()

  const handleDeploy = async () => {
    try {
      // Check if user can deploy subdomain
      const canDeploy = await canDeploySubdomain()
      
      if (!canDeploy) {
        setShowUpgradeModal(true)
        return
      }

      setIsDeploying(true)
      setDeploymentResult(null)

      // Get user session for auth
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`
      }

      // Call deployment API
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers,
        body: JSON.stringify({
          portfolioData,
          template: selectedTemplate,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const deploymentResult = {
          success: true,
          url: result.deploymentUrl,
          subdomain: result.subdomain,
          deployedAt: result.deployedAt,
          template: result.template,
          status: result.status,
        }
        setDeploymentResult(deploymentResult)
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(deploymentResult)
        }
        
        toast({
          title: "Portfolio deployed! 🚀",
          description: `Your portfolio is now live at ${result.deploymentUrl}`,
        })
      } else {
        if (result.requiresUpgrade) {
          setShowUpgradeModal(true)
        } else {
          throw new Error(result.error || "Failed to deploy portfolio")
        }
      }
    } catch (error) {
      console.error("Deployment error:", error)
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const openDeployment = () => {
    if (deploymentResult?.url) {
      window.open(deploymentResult.url, "_blank")
    }
  }

  const handleClose = () => {
    if (!isDeploying) {
      onClose()
      setDeploymentResult(null)
    }
  }

  const getTemplateDisplayName = (template: string) => {
    const templateNames: Record<string, string> = {
      "PortfolioTemplate": "Portfolio",
      "MinimalTemplate": "Minimal",
      "ModernTemplate": "Modern",
      "CreativeTemplate": "Creative",
      "ProfessionalTemplate": "Professional",
      "TechTemplate": "Tech",
      "ExecutiveTemplate": "Executive",
      "ArtisticTemplate": "Artistic",
    }
    return templateNames[template] || template
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Deploy Portfolio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!deploymentResult ? (
              <>
                {/* Deployment Preview */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Portfolio Name</span>
                        <span className="text-sm text-muted-foreground">{portfolioData.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Template</span>
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {getTemplateDisplayName(selectedTemplate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Subdomain</span>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {portfolioData.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 30)}.portfoliobuilder.app
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deploy Button */}
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Deploy Portfolio
                    </>
                  )}
                </Button>

                {isDeploying && (
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Setting up your subdomain and deploying...</p>
                    <p className="mt-1">This may take a few moments.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Success State */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900">Deployment Successful!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your portfolio is now live and accessible
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Live URL</span>
                        <Badge variant="secondary" className="text-xs">
                          {deploymentResult.status}
                        </Badge>
                      </div>
                      <div className="bg-white rounded border p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-xs break-all">
                            {deploymentResult.url}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deployed</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-muted-foreground">
                            {new Date(deploymentResult.deployedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    onClick={openDeployment}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Site
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="deploy"
        onUpgradeComplete={() => {
          setShowUpgradeModal(false)
          handleDeploy()
        }}
      />
    </>
  )
} 