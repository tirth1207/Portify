// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  const isProduction = process.env.NODE_ENV === "production"
  const baseDomain = isProduction ? "portify.co.in" : "localhost:3000"

  const isMainApp =
    host === baseDomain ||
    host === `www.${baseDomain}` ||
    host.includes("vercel.app")

  if (isMainApp) {
    return NextResponse.next()
  }

  // Rewrite subdomain to /_sub/[subdomain] route
  const url = request.nextUrl.clone()
  url.pathname = `/_sub/${subdomain}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static|.*\\..*).*)"],
}
