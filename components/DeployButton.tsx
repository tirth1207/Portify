"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, ExternalLink, CheckCircle, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { canDeploySubdomain } from "@/lib/subscription-client"
import UpgradeModal from "./UpgradeModal"
import { supabase } from "@/lib/supabase"

interface DeployButtonProps {
  portfolioData: any
  selectedTemplate: string
}

export default function DeployButton({ portfolioData, selectedTemplate }: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
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
        setIsDeployed(true)
        setDeploymentUrl(result.deploymentUrl)
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
    if (deploymentUrl) {
      window.open(deploymentUrl, "_blank")
    }
  }

  if (isDeployed && deploymentUrl) {
    return (
      <Button
        onClick={openDeployment}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        View Live Site
        <ExternalLink className="h-4 w-4 ml-2" />
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        {isDeploying ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deploying...
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4 mr-2" />
            Deploy Portfolio
          </>
        )}
      </Button>

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