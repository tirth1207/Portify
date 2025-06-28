"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, ExternalLink, CheckCircle } from "lucide-react"
import DeployDialog from "./DeployDialog"

interface DeployButtonProps {
  portfolioData: any
  selectedTemplate: string
}

export default function DeployButton({ portfolioData, selectedTemplate }: DeployButtonProps) {
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")

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