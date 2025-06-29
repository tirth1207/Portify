import { type NextRequest, NextResponse } from "next/server"
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

// API route to handle portfolio sharing
export async function POST(req: NextRequest) {
  try {
    const { portfolioData, template } = await req.json()

    // Get user from request (you might need to adjust this based on your auth setup)
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Extract user ID from auth header (adjust based on your auth implementation)
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 })
    }

    // Check if user is trying to share a pro template without access
    if (proTemplates.includes(template)) {
      const canUsePro = await canUserUseProTemplates(user.id)
      if (!canUsePro) {
        return NextResponse.json({ 
          error: "Access denied. Pro templates require Standard or Pro subscription." 
        }, { status: 403 })
      }
    }

    // Generate a unique ID
    const portfolioId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

    // Store the portfolio data in database
    const { data, error } = await supabase
      .from("shared_portfolios")
      .insert({
        id: portfolioId,
        portfolio_data: portfolioData,
        template: template,
        expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      shareId: portfolioId,
      shareUrl: `${req.nextUrl.origin}/share/${portfolioId}`,
      data: data,
    })
  } catch (error) {
    console.error("Error creating share link:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}

// API route to get shared portfolio data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const portfolioId = searchParams.get("id")

    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID required" }, { status: 400 })
    }

    // Get from database
    const { data: portfolioData, error } = await supabase
      .from("shared_portfolios")
      .select("*")
      .eq("id", portfolioId)
      .single()

    if (error || !portfolioData) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Check if expired
    if (new Date() > new Date(portfolioData.expires_at)) {
      // Delete expired portfolio
      await supabase
        .from("shared_portfolios")
        .delete()
        .eq("id", portfolioId)
      
      return NextResponse.json({ error: "Portfolio has expired" }, { status: 404 })
    }

    // Update view count and last viewed
    await supabase
      .from("shared_portfolios")
      .update({
        view_count: (portfolioData.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq("id", portfolioId)

    return NextResponse.json({
      success: true,
      data: portfolioData,
    })
  } catch (error) {
    console.error("Error fetching shared portfolio:", error)
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
  }
}
