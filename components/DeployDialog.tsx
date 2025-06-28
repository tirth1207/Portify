"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Rocket, ExternalLink, CheckCircle, X, Loader2, Globe, Calendar, Palette, Check, AlertCircle } from "lucide-react"
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
  const [customSubdomain, setCustomSubdomain] = useState("")
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false)
  const [subdomainStatus, setSubdomainStatus] = useState<"available" | "taken" | "invalid" | null>(null)
  const { toast } = useToast()

  // Generate initial subdomain when dialog opens
  useEffect(() => {
    if (isOpen && !customSubdomain) {
      const initialSubdomain = portfolioData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30)
      setCustomSubdomain(initialSubdomain)
      checkSubdomainAvailability(initialSubdomain)
    }
  }, [isOpen, portfolioData.name, customSubdomain])

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainStatus("invalid")
      return
    }

    // Check if subdomain format is valid
    const subdomainRegex = /^[a-z0-9-]+$/
    if (!subdomainRegex.test(subdomain)) {
      setSubdomainStatus("invalid")
      return
    }

    setIsCheckingSubdomain(true)
    setSubdomainStatus(null)

    try {
      const response = await fetch("/api/check-subdomain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subdomain }),
      })

      const result = await response.json()
      setSubdomainStatus(result.available ? "available" : "taken")
    } catch (error) {
      console.error("Error checking subdomain:", error)
      setSubdomainStatus("invalid")
    } finally {
      setIsCheckingSubdomain(false)
    }
  }

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setCustomSubdomain(cleanValue)
    
    // Debounce the availability check
    const timeoutId = setTimeout(() => {
      checkSubdomainAvailability(cleanValue)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleDeploy = async () => {
    if (subdomainStatus !== "available") {
      toast({
        title: "Invalid subdomain",
        description: "Please choose an available subdomain.",
        variant: "destructive",
      })
      return
    }

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
          selectedTemplate,
          customSubdomain,
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
      setCustomSubdomain("")
      setSubdomainStatus(null)
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

  const getSubdomainStatusIcon = () => {
    if (isCheckingSubdomain) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
    
    switch (subdomainStatus) {
      case "available":
        return <Check className="h-4 w-4 text-green-500" />
      case "taken":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "invalid":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getSubdomainStatusText = () => {
    if (isCheckingSubdomain) {
      return "Checking availability..."
    }
    
    switch (subdomainStatus) {
      case "available":
        return "Available"
      case "taken":
        return "Already taken"
      case "invalid":
        return "Invalid format"
      default:
        return ""
    }
  }

  const getSubdomainStatusColor = () => {
    switch (subdomainStatus) {
      case "available":
        return "text-green-600"
      case "taken":
        return "text-red-600"
      case "invalid":
        return "text-yellow-600"
      default:
        return "text-muted-foreground"
    }
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
            <DialogDescription>
              Deploy your portfolio to a custom subdomain. Choose a unique subdomain name for your portfolio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!deploymentResult ? (
              <>
                {/* Deployment Preview */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
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
                      
                      {/* Subdomain Input */}
                      <div className="space-y-2">
                        <Label htmlFor="subdomain" className="text-sm font-medium">
                          Subdomain
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="subdomain"
                            value={customSubdomain}
                            onChange={(e) => handleSubdomainChange(e.target.value)}
                            placeholder="your-portfolio"
                            className="flex-1"
                            disabled={isDeploying}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            .portify.co.in
                          </span>
                        </div>
                        
                        {/* Subdomain Status */}
                        {subdomainStatus && (
                          <div className="flex items-center gap-2 text-sm">
                            {getSubdomainStatusIcon()}
                            <span className={getSubdomainStatusColor()}>
                              {getSubdomainStatusText()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deploy Button */}
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying || subdomainStatus !== "available"}
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