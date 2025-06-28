// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  // Skip for main domain, localhost, and special subdomains
  if (
    host === "portify.co.in" || 
    host === "www.portify.co.in" ||
    host.includes("localhost") ||
    host.includes("vercel.app") ||
    host.includes("netlify.app") ||
    subdomain === "api" ||
    subdomain === "admin" ||
    subdomain === "www"
  ) {
    return NextResponse.next()
  }

  // Rewrite to internal route like /_sub/[subdomain]
  const url = req.nextUrl.clone()
  url.pathname = `/_sub/${subdomain}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - _sub (internal subdomain routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|_sub).*)",
  ],
}
