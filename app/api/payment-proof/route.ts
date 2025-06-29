// app/api/payment-proof/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure you use SERVICE KEY, not anon key
)

export async function POST(req: NextRequest) {
  try {
    const { name, email, transactionId, amount } = await req.json()

    // Validate required fields
    if (!name || !email || !transactionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get user from auth header or session
    const authHeader = req.headers.get('authorization')
    let userId = null

    if (authHeader) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        if (user && !error) {
          userId = user.id
        }
      } catch (error) {
        console.log("Auth header parsing failed, continuing without user ID")
      }
    }

    const { error } = await supabase.from("payment_proofs").insert([
      {
        name,
        email,
        transaction_id: transactionId,
        user_id: userId,
        amount: amount || 299, // Default amount
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json({ 
      success: true,
      message: "Payment proof submitted successfully"
    })
  } catch (err: any) {
    console.error("❌ Payment proof error:", err.message || err)
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || "Something went wrong" 
      }, 
      { status: 500 }
    )
  }
}
