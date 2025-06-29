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
  isDeployed?: boolean
  deploymentUrl?: string
}

export default function DeployButton({ 
  portfolioData, 
  selectedTemplate, 
  portfolioId,
  isDeployed: propIsDeployed,
  deploymentUrl: propDeploymentUrl
}: DeployButtonProps) {
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [isDeployed, setIsDeployed] = useState(propIsDeployed || false)
  const [deploymentUrl, setDeploymentUrl] = useState(propDeploymentUrl || "")
  const [loading, setLoading] = useState(false) // Start with false since we have props

  useEffect(() => {
    // Update state when props change
    if (propIsDeployed !== undefined) {
      setIsDeployed(propIsDeployed)
    }
    if (propDeploymentUrl !== undefined) {
      setDeploymentUrl(propDeploymentUrl)
    }
    
    console.log("Debug - DeployButton props:", {
      portfolioId,
      propIsDeployed,
      propDeploymentUrl,
      isDeployed,
      deploymentUrl
    })
  }, [propIsDeployed, propDeploymentUrl, portfolioId, isDeployed, deploymentUrl])

  useEffect(() => {
    if (portfolioId && !propIsDeployed && !propDeploymentUrl) {
      setLoading(true)
      checkDeploymentStatus()
    } else {
      setLoading(false)
    }
  }, [portfolioId, propIsDeployed, propDeploymentUrl])

  const checkDeploymentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !portfolioId) {
        setLoading(false)
        return
      }

      const { data: portfolio, error } = await supabase
        .from("portfolios")
        .select("is_deployed, deployment_url, subdomain")
        .eq("id", portfolioId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("Error fetching portfolio:", error)
        // If portfolio not found, check if there's a deployment record
        const { data: deployment } = await supabase
          .from("deployments")
          .select("deployment_url, status")
          .eq("portfolio_id", portfolioId)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (deployment && deployment.status === "completed") {
          setIsDeployed(true)
          setDeploymentUrl(deployment.deployment_url || "")
        } else {
          setIsDeployed(false)
          setDeploymentUrl("")
        }
      } else if (portfolio) {
        // Check both portfolio.is_deployed and deployment status
        const isDeployed = portfolio.is_deployed || false
        const deploymentUrl = portfolio.deployment_url || ""
        
        // If portfolio shows deployed but no URL, check deployments table
        if (isDeployed && !deploymentUrl) {
          const { data: deployment } = await supabase
            .from("deployments")
            .select("deployment_url")
            .eq("portfolio_id", portfolioId)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          if (deployment?.deployment_url) {
            setDeploymentUrl(deployment.deployment_url)
          }
        }
        
        setIsDeployed(isDeployed)
        setDeploymentUrl(deploymentUrl)
      }
    } catch (error) {
      console.error("Error checking deployment status:", error)
      setIsDeployed(false)
      setDeploymentUrl("")
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
    const url = deploymentUrl || propDeploymentUrl
    if (url) {
      window.open(url, "_blank")
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

  // Check if deployed (either from props or state)
  const isCurrentlyDeployed = isDeployed || propIsDeployed
  const currentDeploymentUrl = deploymentUrl || propDeploymentUrl

  if (isCurrentlyDeployed && currentDeploymentUrl) {
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