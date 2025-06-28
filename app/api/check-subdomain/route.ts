import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Check if subdomain is available
export async function POST(req: NextRequest) {
  try {
    const { subdomain } = await req.json()

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 })
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({ 
        available: false, 
        error: "Subdomain can only contain lowercase letters, numbers, and hyphens" 
      })
    }

    if (subdomain.length < 3) {
      return NextResponse.json({ 
        available: false, 
        error: "Subdomain must be at least 3 characters long" 
      })
    }

    if (subdomain.length > 30) {
      return NextResponse.json({ 
        available: false, 
        error: "Subdomain must be 30 characters or less" 
      })
    }

    // Check if subdomain already exists in database
    const { data: existingPortfolio, error } = await supabase
      .from("portfolios")
      .select("id")
      .eq("subdomain", subdomain)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to check subdomain availability" }, { status: 500 })
    }

    const available = !existingPortfolio

    return NextResponse.json({
      available,
      subdomain,
      message: available ? "Subdomain is available" : "Subdomain is already taken"
    })
  } catch (error) {
    console.error("Subdomain check failed:", error)
    return NextResponse.json({ error: "Failed to check subdomain availability" }, { status: 500 })
  }
}
