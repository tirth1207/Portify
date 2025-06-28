import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Check if this is a subdomain request
  const subdomain = hostname.split('.')[0]
  
  // Skip if it's the main domain or localhost
  if (hostname === 'portify.co.in' || hostname === 'localhost:3000' || hostname.includes('localhost')) {
    return NextResponse.next()
  }

  // Check if it's a valid subdomain (not www, api, etc.)
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    return NextResponse.next()
  }

  // Check if the subdomain exists in our database
  return checkSubdomainAndRedirect(request, subdomain)
}

async function checkSubdomainAndRedirect(request: NextRequest, subdomain: string) {
  try {
    // Query the database for the portfolio with this subdomain
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_deployed', true)
      .single()

    if (error || !portfolio) {
      // Subdomain not found, redirect to main site
      const url = request.nextUrl.clone()
      url.hostname = 'portify.co.in'
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Portfolio found, serve it via the share route
    const url = request.nextUrl.clone()
    url.hostname = 'portify.co.in'
    url.pathname = `/share/${portfolio.id}`
    
    return NextResponse.rewrite(url)
  } catch (error) {
    console.error('Error checking subdomain:', error)
    // On error, redirect to main site
    const url = request.nextUrl.clone()
    url.hostname = 'portify.co.in'
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}