"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Crown, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { canDeploySubdomain, canExportCode, canRemoveBranding } from "@/lib/subscription-client"
import { useState, useEffect } from "react"

interface ProFeatureGateProps {
  children: ReactNode
  feature: "deploy" | "export" | "branding" | "analytics"
  fallback?: ReactNode
}

export default function ProFeatureGate({ children, feature, fallback }: ProFeatureGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAccess()
  }, [feature])

  const checkAccess = async () => {
    try {
      let access = false
      
      switch (feature) {
        case "deploy":
          access = await canDeploySubdomain()
          break
        case "export":
          access = await canExportCode()
          break
        case "branding":
          access = await canRemoveBranding()
          break
        case "analytics":
          // Analytics is Pro-only for now
          access = false
          break
        default:
          access = false
      }
      
      setHasAccess(access)
    } catch (error) {
      console.error("Error checking feature access:", error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeClick = () => {
    window.location.href = "/pricing"
  }

  const getFeatureInfo = () => {
    switch (feature) {
      case "deploy":
        return {
          title: "Subdomain Deployment",
          description: "Deploy your portfolio to a custom subdomain (yourname.portfoliobuilder.app)",
          plan: "Standard"
        }
      case "export":
        return {
          title: "Code Export",
          description: "Download the complete source code to host anywhere",
          plan: "Pro"
        }
      case "branding":
        return {
          title: "Remove Branding",
          description: "Remove Portify branding from your portfolio",
          plan: "Standard"
        }
      case "analytics":
        return {
          title: "Analytics Dashboard",
          description: "Track portfolio views and visitor insights",
          plan: "Pro"
        }
      default:
        return {
          title: "Premium Feature",
          description: "This feature requires a premium subscription",
          plan: "Pro"
        }
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    )
  }

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const featureInfo = getFeatureInfo()

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-50"></div>
      <div className="relative p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {featureInfo.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {featureInfo.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            {featureInfo.plan} Plan
          </Badge>
          <Button
            onClick={handleUpgradeClick}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Crown className="h-4 w-4 mr-1" />
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  )
}

// Badge component for the feature gate
function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
} 