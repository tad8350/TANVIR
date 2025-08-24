import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // TEMPORARY: Skip middleware for testing - remove this after fixing the redirect loop
  if (pathname.startsWith('/dashboard')) {
    console.log('Middleware: Allowing access to dashboard for testing');
    return NextResponse.next();
  }
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/assets')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/admin/signin', '/brand/signin', '/product'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const token = request.cookies.get('token')?.value;
  const userData = request.cookies.get('user')?.value;
  
  // If no token or user data, redirect to signin
  if (!token || !userData) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Validate user data
  try {
    const user = JSON.parse(userData);
    if (!user || !user.id || !user.email) {
      // Invalid user data, clear cookies and redirect to signin
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
    
    // Valid authentication, allow access
    return NextResponse.next();
  } catch {
    // Invalid JSON in user cookie, clear cookies and redirect to signin
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('token');
    response.cookies.delete('user');
    return response;
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
}; 