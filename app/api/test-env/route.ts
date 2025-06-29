import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: "Environment variables check completed"
    })

  } catch (error) {
    return NextResponse.json({
      error: "Environment check failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 