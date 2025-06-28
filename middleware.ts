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
    console.log(`[middleware] Main app accessed → ${host}`)
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()

  // Prevent infinite loop or malformed URL rewrites
  if (!subdomain || subdomain === "www" || subdomain === "api") {
    console.warn(`[middleware] Invalid or reserved subdomain: ${subdomain}`)
    return NextResponse.next()
  }

  // Rewrite to /_sub/[subdomain]/[...rest]
  url.pathname = `/subdomains/${subdomain}${url.pathname}`
  console.log(`[middleware] Subdomain: ${subdomain} → rewriting to ${url.pathname}`)

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Match all paths except these
    "/((?!_next|favicon.ico|api|static|.*\\..*).*)",
  ],
}
