"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Zap, Star, AlertCircle, CheckCircle } from "lucide-react"
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/subscription-client"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface PlanStatusProps {
  onUpgradeClick?: () => void
}

export default function PlanStatus({ onUpgradeClick }: PlanStatusProps) {
  const [userPlan, setUserPlan] = useState<SubscriptionPlan | null>(null)
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get user's subscription tier
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()

      const tier = profile?.subscription_tier || "free"
      const plan = SUBSCRIPTION_PLANS.find(p => p.name.toLowerCase() === tier) || SUBSCRIPTION_PLANS[0]
      setUserPlan(plan)

      // Get portfolio count
      const { count } = await supabase
        .from("portfolios")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      setPortfolioCount(count || 0)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return <Star className="h-4 w-4" />
      case "standard":
        return <Zap className="h-4 w-4" />
      case "pro":
        return <Crown className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pro":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const isAtLimit = () => {
    if (!userPlan) return false
    return portfolioCount >= userPlan.limits.maxPortfolios
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userPlan) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getPlanIcon(userPlan.name)}
            {userPlan.name} Plan
          </CardTitle>
          <Badge className={getPlanColor(userPlan.name)}>
            {userPlan.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Portfolios:</span>
          <span className="font-medium">
            {portfolioCount} / {userPlan.limits.maxPortfolios === Infinity ? "∞" : userPlan.limits.maxPortfolios}
          </span>
        </div>

        {isAtLimit() && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              You've reached your portfolio limit
            </span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Subdomain deployment: {userPlan.limits.subdomainDeployment ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Remove branding: {userPlan.limits.brandingRemoval ? "Yes" : "No"}</span>
          </div>
        </div>

        {userPlan.name !== "Pro" && (
          <div className="pt-2">
            <Button 
              onClick={onUpgradeClick}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 