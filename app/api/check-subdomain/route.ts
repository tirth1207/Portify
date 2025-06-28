import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Check if subdomain is available
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const generateSubdomain = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30)
    }

    const subdomain = generateSubdomain(name)
    const domainName = `${subdomain}.portify.co.in`

    // Check if subdomain already exists in database
    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id, name")
      .eq("subdomain", subdomain)
      .single()

    const isAvailable = !existingPortfolio

    return NextResponse.json({
      success: true,
      subdomain,
      domainName,
      isAvailable,
      existingPortfolio: existingPortfolio ? {
        name: existingPortfolio.name
      } : null
    })
  } catch (error: any) {
    console.error("Subdomain check failed:", error)
    return NextResponse.json(
      { error: "Subdomain check failed", details: error.message },
      { status: 500 }
    )
  }
}
