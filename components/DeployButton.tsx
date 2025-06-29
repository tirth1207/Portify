"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, ExternalLink, CheckCircle } from "lucide-react"
import DeployDialog from "./DeployDialog"
import { supabase } from "@/lib/supabase"

interface DeployButtonProps {
  portfolioData: any
  selectedTemplate: string
  portfolioId?: string
}

export default function DeployButton({ portfolioData, selectedTemplate, portfolioId }: DeployButtonProps) {
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (portfolioId) {
      checkDeploymentStatus()
    } else {
      setLoading(false)
    }
  }, [portfolioId])

  const checkDeploymentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !portfolioId) return

      const { data: portfolio, error } = await supabase
        .from("portfolios")
        .select("is_deployed, deployment_url, subdomain")
        .eq("id", portfolioId)
        .eq("user_id", user.id)
        .single()

      if (!error && portfolio) {
        setIsDeployed(portfolio.is_deployed || false)
        setDeploymentUrl(portfolio.deployment_url || "")
      }
    } catch (error) {
      console.error("Error checking deployment status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeployClick = () => {
    setShowDeployDialog(true)
  }

  const handleDeploySuccess = (result: any) => {
    setIsDeployed(true)
    setDeploymentUrl(result.url)
    setShowDeployDialog(false)
  }

  const openDeployment = () => {
    if (deploymentUrl) {
      window.open(deploymentUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <Button disabled className="bg-gray-400 text-white">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Loading...
      </Button>
    )
  }

  if (isDeployed && deploymentUrl) {
    return (
      <Button
        onClick={openDeployment}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Visit Live Site
        <ExternalLink className="h-4 w-4 ml-2" />
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleDeployClick}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        <Rocket className="h-4 w-4 mr-2" />
        Deploy Portfolio
      </Button>

      <DeployDialog
        isOpen={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        portfolioData={portfolioData}
        selectedTemplate={selectedTemplate}
        onSuccess={handleDeploySuccess}
      />
    </>
  )
} 