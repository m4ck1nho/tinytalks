import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // CRITICAL: Force www to non-www redirect (301 Permanent Redirect)
  // This ensures consistent canonical URLs and prevents duplicate content issues
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone();
    // Remove www. prefix from hostname
    const nonWwwHost = hostname.replace(/^www\./, '');
    url.host = nonWwwHost;
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // CRITICAL: Redirect all /en/* routes to homepage (301 Permanent Redirect)
  // This removes ghost English pages that are causing canonical tag errors
  if (pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  // CRITICAL: Ensure Google can index the site
  // Remove any blocking headers and explicitly allow indexing
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // Ensure we're NOT setting X-Google-Extended-Opt-Out
  // If this header exists, remove it
  response.headers.delete('X-Google-Extended-Opt-Out');
  
  // Explicitly allow Googlebot and other search engines
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');

  return response;
}

// Apply middleware to all routes except static files and API routes
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
};

