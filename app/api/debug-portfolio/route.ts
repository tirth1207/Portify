import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subdomain = searchParams.get('subdomain')

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain parameter required" }, { status: 400 })
    }

    // Query the database for the portfolio with this subdomain
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('subdomain', subdomain)
      .single()

    if (error) {
      return NextResponse.json({ 
        error: "Portfolio not found", 
        details: error.message,
        subdomain 
      })
    }

    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
        subdomain: portfolio.subdomain,
        is_deployed: portfolio.is_deployed,
        deployment_url: portfolio.deployment_url,
        template: portfolio.template,
        created_at: portfolio.created_at
      }
    })
  } catch (error) {
    console.error('Debug portfolio error:', error)
    return NextResponse.json({ error: "Failed to check portfolio" }, { status: 500 })
  }
} 