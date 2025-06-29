import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Define which templates are pro templates
const proTemplates = ["creative", "tech", "artistic", "executive", "premium"]

// Function to check if user can use pro templates
async function canUserUseProTemplates(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .single()

    const tier = profile?.subscription_tier || "free"
    return tier === "pro" || tier === "standard"
  } catch (error) {
    console.error("Error checking user subscription:", error)
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Check if user is trying to access a pro template without access
    if (proTemplates.includes(portfolio.template)) {
      // Get user from request
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "")
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        
        if (!authError && user) {
          const canUsePro = await canUserUseProTemplates(user.id)
          if (!canUsePro) {
            return NextResponse.json({ 
              error: "Access denied. Pro templates require Standard or Pro subscription." 
            }, { status: 403 })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: portfolio
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
} 