import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated
  const token = request.cookies.get('token')?.value;
  const userData = request.cookies.get('user')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If accessing a protected route without authentication, redirect to signin
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // If accessing auth pages while already authenticated, redirect to homepage
  if (token && userData && isPublicRoute && pathname !== '/') {
    try {
      const user = JSON.parse(userData);
      // Redirect all authenticated users to homepage
      return NextResponse.redirect(new URL('/', request.url));
    } catch {
      // If user data is invalid, clear cookies and redirect to signin
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
  }
  
  // Role-based access control for dashboard routes
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      
      // Admin routes - only admins can access
      if (pathname.startsWith('/admin') && user.user_type !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      
      // Brand routes - only brands can access
      if (pathname.startsWith('/brand') && user.user_type !== 'brand') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      
      // Customer routes - only customers can access
      if (pathname.startsWith('/customer') && user.user_type !== 'customer') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } catch {
      // If user data is invalid, clear cookies and redirect to signin
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
  }
  
  return NextResponse.next();
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