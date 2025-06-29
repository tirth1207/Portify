import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    console.log("API - Fetching portfolio with ID:", id)

    if (!id) {
      console.log("API - No portfolio ID provided")
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }

    // First, try to get the portfolio without authentication check
    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", id)
      .single()

    console.log("API - Portfolio query result:", { 
      hasData: !!portfolio, 
      error: error?.message,
      template: portfolio?.template 
    })

    if (error) {
      console.error("API - Database error:", error)
      return NextResponse.json({ 
        error: "Portfolio not found",
        details: error.message 
      }, { status: 404 })
    }

    if (!portfolio) {
      console.log("API - No portfolio found with ID:", id)
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Check if user is trying to access a pro template without access
    if (proTemplates.includes(portfolio.template)) {
      console.log("API - Pro template detected:", portfolio.template)
      // Get user from request
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "")
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        
        if (!authError && user) {
          console.log("API - User authenticated:", user.email)
          const canUsePro = await canUserUseProTemplates(user.id)
          if (!canUsePro) {
            console.log("API - Access denied for pro template")
            return NextResponse.json({ 
              error: "Access denied. Pro templates require Standard or Pro subscription." 
            }, { status: 403 })
          }
        } else {
          console.log("API - Authentication failed:", authError?.message)
        }
      } else {
        console.log("API - No authorization header provided")
      }
    }

    console.log("API - Returning portfolio data successfully")
    return NextResponse.json({
      success: true,
      data: portfolio
    })
  } catch (error) {
    console.error("API - Unexpected error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch portfolio",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 