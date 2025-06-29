import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get("id")

    console.log("Test DB - Checking portfolio ID:", portfolioId)

    if (!portfolioId) {
      return NextResponse.json({ 
        error: "Portfolio ID required",
        usage: "Add ?id=PORTFOLIO_ID to the URL"
      }, { status: 400 })
    }

    // Test database connection
    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", portfolioId)
      .single()

    if (error) {
      console.error("Test DB - Database error:", error)
      return NextResponse.json({
        error: "Database error",
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    if (!portfolio) {
      return NextResponse.json({
        error: "Portfolio not found",
        portfolioId
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
        template: portfolio.template,
        is_deployed: portfolio.is_deployed,
        deployment_url: portfolio.deployment_url,
        created_at: portfolio.created_at
      }
    })

  } catch (error) {
    console.error("Test DB - Unexpected error:", error)
    return NextResponse.json({
      error: "Unexpected error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 