import { supabase } from "./supabase"

export interface SubscriptionPlan {
  name: string
  price: number
  description: string
  features: string[]
  limits: {
    maxPortfolios: number
    subdomainDeployment: boolean
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
      brandingRemoval: false
    }
  },
  {
    name: "Standard",
    price: 199,
    description: "For creators who want more control and visibility.",
    features: [
      "Create up to 5 portfolios",
      "Subdomain deployment (yourname.portify.co.in)",
      "More template choices",
      "Remove Portify branding"
    ],
    limits: {
      maxPortfolios: 5,
      subdomainDeployment: true,
      brandingRemoval: true
    }
  },
  {
    name: "Pro",
    price: 299,
    description: "Full access to all features, for serious devs and freelancers.",
    features: [
      "Unlimited portfolios",
      "Subdomain deployment",
      "Premium templates",
      "No Portify branding",
      "Analytics & future integrations"
    ],
    limits: {
      maxPortfolios: Infinity,
      subdomainDeployment: true,
      brandingRemoval: true
    }
  }
]

export async function getUserSubscriptionTier(): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return "free"

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single()

    const tier = profile?.subscription_tier || "free"
    console.log("Debug - Subscription tier from DB:", tier)
    return tier
  } catch (error) {
    console.error("Error getting user subscription tier:", error)
    return "free"
  }
}

export async function getUserPlan(): Promise<SubscriptionPlan> {
  const tier = await getUserSubscriptionTier()
  // Convert tier to lowercase for case-insensitive comparison
  const normalizedTier = tier.toLowerCase()
  console.log("Debug - Normalized tier:", normalizedTier)
  
  const plan = SUBSCRIPTION_PLANS.find(plan => plan.name.toLowerCase() === normalizedTier) || SUBSCRIPTION_PLANS[0]
  console.log("Debug - Found plan:", plan.name)
  return plan
}

export async function canCreatePortfolio(): Promise<{ canCreate: boolean; reason?: string }> {
  try {
    const userPlan = await getUserPlan()
    const { data: { user } } = await supabase.auth.getUser()

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
  } catch (error) {
    console.error("Error checking portfolio creation:", error)
    return { canCreate: false, reason: "Error checking portfolio limits" }
  }
}

export async function canDeploySubdomain(): Promise<boolean> {
  try {
    const userPlan = await getUserPlan()
    return userPlan.limits.subdomainDeployment
  } catch (error) {
    console.error("Error checking deployment access:", error)
    return false
  }
}

export async function canRemoveBranding(): Promise<boolean> {
  try {
    const userPlan = await getUserPlan()
    return userPlan.limits.brandingRemoval
  } catch (error) {
    console.error("Error checking branding removal access:", error)
    return false
  }
}

export async function canUseProTemplates(): Promise<boolean> {
  try {
    const userPlan = await getUserPlan()
    // Only Pro and Standard plans can use pro templates
    return userPlan.name === "Pro" || userPlan.name === "Standard"
  } catch (error) {
    console.error("Error checking pro template access:", error)
    return false
  }
}

// Test function to verify subscription checking
export async function testSubscriptionAccess(): Promise<{
  user: any
  subscriptionTier: string
  userPlan: any
  canUsePro: boolean
  error?: string
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        user: null,
        subscriptionTier: "no-user",
        userPlan: null,
        canUsePro: false,
        error: "No user found"
      }
    }

    const subscriptionTier = await getUserSubscriptionTier()
    const userPlan = await getUserPlan()
    const canUsePro = await canUseProTemplates()

    return {
      user,
      subscriptionTier,
      userPlan,
      canUsePro
    }
  } catch (error) {
    return {
      user: null,
      subscriptionTier: "error",
      userPlan: null,
      canUsePro: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Export feature was removed, but keeping this function for compatibility
export async function canExportCode(): Promise<boolean> {
  return false // Export feature is no longer available
} 