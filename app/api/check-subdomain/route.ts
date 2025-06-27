import { NextRequest, NextResponse } from "next/server"

// Check if subdomain is available
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    const generateSubdomain = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30)
    }

    const subdomain = generateSubdomain(name)
    
    // In a real implementation, check against your database/DNS records
    const isAvailable = Math.random() > 0.3 // Simulate availability check
    
    return NextResponse.json({
      subdomain,
      available: isAvailable,
      url: `https://${subdomain}.portfoliobuilder.app`
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check subdomain availability" },
      { status: 500 }
    )
  }
}
