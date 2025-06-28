import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Test the specific subdomain from your database
    const subdomain = "tirth-rathod"
    
    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("subdomain", subdomain)
      .eq("is_deployed", true)
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
      },
      testUrl: `https://${subdomain}.portify.co.in`,
      localTestUrl: `http://localhost:3000/_sub/${subdomain}`
    })
  } catch (error) {
    console.error('Test subdomain error:', error)
    return NextResponse.json({ error: "Failed to test subdomain" }, { status: 500 })
  }
} 