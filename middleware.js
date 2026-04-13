import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // If the path starts with /arabic (e.g., /arabic or /arabic/products)
  if (pathname.startsWith('/arabic')) {
    // Exclude API, static assets, etc. just in case config matcher misses
    if (pathname.startsWith('/arabic/_next') || pathname.startsWith('/arabic/api')) {
        return NextResponse.next();
    }

    const targetPath = pathname.replace(/^\/arabic/, '') || '/';
    
    // We rewrite to the internal route, but preserve the URL for the user
    // e.g. /arabic/product/123 -> /product/123 under the hood
    const response = NextResponse.rewrite(new URL(targetPath, request.url));
    
    // Pass headers down to layout.js so it can set RTL immediately
    response.headers.set('x-locale', 'ar');
    
    // Enforce the translation cookie so GTranslate catches on automatically
    response.cookies.set('googtrans', '/en/ar', { path: '/' });
    
    return response;
  }
  
  // For all routes not mapped to /arabic, we assume English
  const response = NextResponse.next();
  response.headers.set('x-locale', 'en');
  // NOTE: Do NOT delete googtrans here — Next.js prefetches non-arabic routes
  // even while the user is on /arabic, which would wipe the cookie mid-session.
  // Cookie cleanup is handled client-side in Navbar.js changeLanguage().
  return response;
}

export const config = {
  // Match standard paths, ignore Next internal system paths
  matcher: ['/((?!_next|api|public|images|favicon.ico).*)'],
}
