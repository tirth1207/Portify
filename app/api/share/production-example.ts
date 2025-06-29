// Example of how to implement this with a real database (Supabase/PostgreSQL)
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for server-side operations
)

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, template } = await req.json()

    const portfolioId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day

    const { data, error } = await supabase
      .from("shared_portfolios")
      .insert({
        id: portfolioId,
        portfolio_data: portfolioData,
        template: template,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) throw error

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const portfolioId = searchParams.get("id")

    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("shared_portfolios")
      .select("*")
      .eq("id", portfolioId)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Update view count
    await supabase
      .from("shared_portfolios")
      .update({
        view_count: (data.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq("id", portfolioId)

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error fetching shared portfolio:", error)
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
  }
}
