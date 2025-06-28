// app/api/payment-proof/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure you use SERVICE KEY, not anon key
)

export async function POST(req: NextRequest) {
  try {
    const { name, email, transactionId } = await req.json()

    const { error } = await supabase.from("payment_proofs").insert([
      {
        name,
        email,
        transaction_id: transactionId,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("❌ Payment proof error:", err.message || err)
    return NextResponse.json({ success: false, error: err.message || "Something went wrong" }, { status: 500 })
  }
}
