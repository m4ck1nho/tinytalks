import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL: Redirect all /en/* routes to homepage (301 Permanent Redirect)
  // This removes ghost English pages that are causing canonical tag errors
  if (pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If Supabase is not configured, allow public routes and redirect protected routes
    if (pathname.startsWith('/crm/') || pathname.startsWith('/admin/') || pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    
    // Still set SEO headers even without Supabase
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    response.headers.delete('X-Google-Extended-Opt-Out');
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return response;
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Refresh session if expired - required for Server Components
    await supabase.auth.getUser()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes that require authentication
    if (pathname.startsWith('/crm/') || pathname.startsWith('/admin/') || pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/') && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    // If there's an error with Supabase, just continue without authentication
    console.warn('Supabase authentication error in middleware:', error)
  }

  // CRITICAL: Ensure Google can index the site
  // Remove any blocking headers and explicitly allow indexing
  supabaseResponse.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // Ensure we're NOT setting X-Google-Extended-Opt-Out
  // If this header exists, remove it
  supabaseResponse.headers.delete('X-Google-Extended-Opt-Out');
  
  // Explicitly allow Googlebot and other search engines
  supabaseResponse.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|html)$).*)',
  ],
}
