// app/api/admin/payments/route.ts
import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("status", "pending")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
