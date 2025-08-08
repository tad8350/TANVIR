import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const userData = request.cookies.get('user')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/', '/admin/signin'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Handle admin routes specifically
  if (pathname.startsWith('/admin')) {
    // If accessing admin routes without admin token, redirect to admin signin
    if (!adminToken && pathname !== '/admin/signin') {
      return NextResponse.redirect(new URL('/admin/signin', request.url));
    }
    
    // If accessing admin signin while already authenticated, redirect to admin dashboard
    if (adminToken && pathname === '/admin/signin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    // Allow access to admin routes if admin token exists
    if (adminToken) {
      return NextResponse.next();
    }
  }
  
  // Handle regular user routes
  if (!pathname.startsWith('/admin')) {
    // If accessing a protected route without authentication, redirect to signin
    if (!token && !isPublicRoute) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // If accessing homepage while authenticated, redirect to appropriate dashboard
    if (token && userData && pathname === '/') {
      try {
        const user = JSON.parse(userData);
        // Redirect authenticated users to dashboard based on their role
        if (user.user_type === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (user.user_type === 'brand') {
          return NextResponse.redirect(new URL('/brand/dashboard', request.url));
        } else {
          // Default for customers and other user types
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        // If user data is invalid, clear cookies and redirect to signin
        const response = NextResponse.redirect(new URL('/auth/signin', request.url));
        response.cookies.delete('token');
        response.cookies.delete('user');
        return response;
      }
    }
    
    // If accessing auth pages while already authenticated, redirect to dashboard
    if (token && userData && isPublicRoute && pathname !== '/') {
      try {
        const user = JSON.parse(userData);
        // Redirect authenticated users to dashboard based on their role
        if (user.user_type === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (user.user_type === 'brand') {
          return NextResponse.redirect(new URL('/brand/dashboard', request.url));
        } else {
          // Default for customers and other user types
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
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