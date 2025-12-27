import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /en/* to homepage (fix ghost English pages)
  if (pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  // Simple pass-through middleware that only sets SEO headers.
  // Auth guarding is handled on the client (AdminShell/useAuth).
  const response = NextResponse.next();

  // Ensure Google can index the site
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  // Remove any blocking headers
  response.headers.delete('X-Google-Extended-Opt-Out');

  return response;
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
