// lib/subscription.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface SubscriptionPlan {
  name: string
  price: number
  description: string
  features: string[]
  limits: {
    maxPortfolios: number
    subdomainDeployment: boolean
    codeExport: boolean
    brandingRemoval: boolean
  }
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Free",
    price: 0,
    description: "Ideal for beginners creating a single portfolio.",
    features: [
      "Create 1 portfolio",
      "Basic templates",
      "Shareable link (e.g., /share/abc123)",
      "Portify branding"
    ],
    limits: {
      maxPortfolios: 1,
      subdomainDeployment: false,
      codeExport: false,
      brandingRemoval: false
    }
  },
  {
    name: "Standard",
    price: 199,
    description: "For creators who want more control and visibility.",
    features: [
      "Create up to 5 portfolios",
      "Subdomain deployment (yourname.portfoliobuilder.app)",
      "More template choices",
      "Remove Portify branding"
    ],
    limits: {
      maxPortfolios: 5,
      subdomainDeployment: true,
      codeExport: false,
      brandingRemoval: true
    }
  },
  {
    name: "Pro",
    price: 299,
    description: "Full access to all features, for serious devs and freelancers.",
    features: [
      "Unlimited portfolios",
      "Subdomain + code export",
      "Premium templates",
      "No Portify branding",
      "Analytics & future integrations"
    ],
    limits: {
      maxPortfolios: Infinity,
      subdomainDeployment: true,
      codeExport: true,
      brandingRemoval: true
    }
  }
]

export async function isUserPro(): Promise<boolean> {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single()

  return profile?.subscription_tier === "pro"
}

export async function getUserSubscriptionTier(): Promise<string> {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return "free"

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single()

  return profile?.subscription_tier || "free"
}

export async function getUserPlan(): Promise<SubscriptionPlan> {
  const tier = await getUserSubscriptionTier()
  return SUBSCRIPTION_PLANS.find(plan => plan.name.toLowerCase() === tier) || SUBSCRIPTION_PLANS[0]
}

export async function canCreatePortfolio(): Promise<{ canCreate: boolean; reason?: string }> {
  const userPlan = await getUserPlan()
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { canCreate: false, reason: "Please log in to create portfolios" }
  }

  // Count existing portfolios
  const { count } = await supabase
    .from("portfolios")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (count === null) {
    return { canCreate: false, reason: "Unable to check portfolio count" }
  }

  if (count >= userPlan.limits.maxPortfolios) {
    return { 
      canCreate: false, 
      reason: `You've reached the limit of ${userPlan.limits.maxPortfolios} portfolio${userPlan.limits.maxPortfolios === 1 ? '' : 's'} for your ${userPlan.name} plan` 
    }
  }

  return { canCreate: true }
}

export async function canDeploySubdomain(): Promise<boolean> {
  const userPlan = await getUserPlan()
  return userPlan.limits.subdomainDeployment
}

export async function canExportCode(): Promise<boolean> {
  const userPlan = await getUserPlan()
  return userPlan.limits.codeExport
}

export async function canRemoveBranding(): Promise<boolean> {
  const userPlan = await getUserPlan()
  return userPlan.limits.brandingRemoval
}
