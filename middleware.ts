import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow the login page and auth API route through without blocking
  if (path === '/admin/login' || path.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (path.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('timaitha_session');

    // Must match the exact token string set in the login API route
    if (!sessionCookie || sessionCookie.value !== 'timaitha_session_token_verified') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};