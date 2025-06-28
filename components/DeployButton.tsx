"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, Loader2, CheckCircle, ExternalLink, Copy, AlertCircle, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProFeatureGate from "./ProFeatureGate"

interface DeployButtonProps {
  portfolioData: any
  selectedTemplate: string
}

export default function DeployButton({ portfolioData, selectedTemplate }: DeployButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [customSubdomain, setCustomSubdomain] = useState("")
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (portfolioData?.name) {
      checkSubdomainAvailability(portfolioData.name)
    }
  }, [portfolioData?.name])

  const checkSubdomainAvailability = async (name: string) => {
    setIsCheckingAvailability(true)
    try {
      const response = await fetch("/api/check-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const result = await response.json()
      setSubdomain(result.subdomain)
      setSubdomainAvailable(result.available)
      setCustomSubdomain(result.subdomain)
    } catch (error) {
      console.error("Failed to check subdomain:", error)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioData,
          selectedTemplate,
          userInfo: { subdomain: customSubdomain },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setDeploymentUrl(result.url)
        setIsDeployed(true)
        toast({
          title: "Portfolio Deployed! 🚀",
          description: `Your portfolio is now live at ${result.url}`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    })
  }

  const openPortfolio = () => {
    window.open(deploymentUrl, "_blank")
  }

  return (
    <ProFeatureGate feature="deploy">
      {isDeployed ? (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Portfolio Deployed!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Your portfolio is now live</p>
              </div>
            </div>

            <div className="bg-white dark:bg-green-900 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{deploymentUrl}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(deploymentUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={openPortfolio}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={openPortfolio} className="flex-1">
                <Globe className="h-4 w-4 mr-2" />
                View Portfolio
              </Button>
              <Button variant="outline" onClick={() => setIsDeployed(false)}>
                Deploy Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Deploy Your Portfolio
              </DialogTitle>
              <DialogDescription>
                Deploy your portfolio to a custom subdomain and share it with the world.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Subdomain Configuration */}
              <div className="space-y-3">
                <Label htmlFor="subdomain">Choose Your Subdomain</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    value={customSubdomain}
                    onChange={(e) => setCustomSubdomain(e.target.value)}
                    placeholder="your-name"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">.portfoliobuilder.app</span>
                </div>

                {isCheckingAvailability ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking availability...
                  </div>
                ) : subdomainAvailable !== null ? (
                  <div
                    className={`flex items-center gap-2 text-sm ${subdomainAvailable ? "text-green-600" : "text-red-600"}`}
                  >
                    {subdomainAvailable ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Subdomain available!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        Subdomain not available
                      </>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Preview URL */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your portfolio will be available at:
                </Label>
                <div className="mt-2 font-mono text-sm text-blue-600 dark:text-blue-400">
                  https://{customSubdomain || "your-name"}.portfoliobuilder.app
                </div>
              </div>

              {/* Template Info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Template</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{selectedTemplate}</p>
                </div>
                <Badge variant="secondary">{selectedTemplate}</Badge>
              </div>

              {/* Deploy Button */}
              <Button
                onClick={handleDeploy}
                disabled={isDeploying || !subdomainAvailable || !customSubdomain}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

              <p className="text-xs text-gray-500 text-center">
                Deployment typically takes 2-3 minutes. Your portfolio will be live with SSL certificate.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ProFeatureGate>
  )
}
