import { type NextRequest, NextResponse } from "next/server"

// API route to handle portfolio sharing
export async function POST(req: NextRequest) {
  try {
    const { portfolioData, template } = await req.json()

    // Generate a unique ID
    const portfolioId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

    // In a real application, you would:
    // 1. Save the portfolio data to your database
    // 2. Associate it with the unique ID
    // 3. Set up proper expiration/cleanup

    // For this demo, we'll return the ID and let the frontend handle storage
    const shareData = {
      id: portfolioId,
      data: portfolioData,
      template: template,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }

    return NextResponse.json({
      success: true,
      shareId: portfolioId,
      shareUrl: `${req.nextUrl.origin}/share/${portfolioId}`,
      data: shareData,
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

    // In a real application, you would fetch from your database
    // For now, we'll return a success response and let the frontend handle localStorage

    return NextResponse.json({
      success: true,
      message: "Use localStorage for demo",
    })
  } catch (error) {
    console.error("Error fetching shared portfolio:", error)
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
  }
}
