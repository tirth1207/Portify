"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import UpgradeModal from "./UpgradeModal"

interface ProFeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export default function ProFeatureGate({ feature, children, fallback, className = "" }: ProFeatureGateProps) {
  const [showUpgrade, setShowUpgrade] = useState(false)

  // In a real app, this would check the user's subscription status
  const isPro = false // This would come from your auth/subscription context

  if (isPro) {
    return <>{children}</>
  }

  const defaultFallback = (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 flex items-center justify-center z-10">
        <div className="text-center p-6">
          {/* <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pro Feature</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Upgrade to Portify Pro to unlock this feature</p> */}
          <Button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">{children}</div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} feature={feature} />
    </div>
  )

  return fallback || defaultFallback
}
