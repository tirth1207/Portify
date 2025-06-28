// app/api/admin/verify/route.ts
import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies })
  const { id, userId, plan } = await req.json()

  // Update payment proof status
  const { error: updateStatusErr } = await supabase
    .from("payment_proofs")
    .update({ status: "verified" })
    .eq("id", id)

  // Determine subscription tier based on plan
  let subscriptionTier = "pro" // Default for backward compatibility
  if (plan) {
    const planName = plan.toLowerCase()
    if (planName === "standard") {
      subscriptionTier = "standard"
    } else if (planName === "pro") {
      subscriptionTier = "pro"
    } else {
      subscriptionTier = "free"
    }
  }

  // Update user's subscription tier
  const { error: updateTierErr } = await supabase
    .from("profiles")
    .update({ subscription_tier: subscriptionTier })
    .eq("id", userId)

  if (updateStatusErr || updateTierErr) {
    console.error("Verification errors:", { updateStatusErr, updateTierErr })
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true,
    subscriptionTier 
  })
}
