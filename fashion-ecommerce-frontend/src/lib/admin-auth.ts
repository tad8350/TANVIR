import { apiService } from './api';
import { toast } from 'sonner';

/**
 * Comprehensive logout function for admin users
 * Clears all authentication state and redirects to signin page
 */
export const adminLogout = (router: any) => {
  try {
    console.log('🚪 Starting admin logout process...');
    
    // Clear authentication state using API service
    apiService.logout();
    console.log('✅ API service logout completed');
    
    // Clear any additional admin-related data from localStorage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('brandFormDraft');
    localStorage.removeItem('productFormDraft');
    console.log('✅ LocalStorage cleared');
    
    // Clear any other cookies that might exist
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('✅ Cookies cleared');
    
    console.log('🔄 Redirecting to /admin/signin...');
    
    // Immediate redirect without toast notification
    // The toast might be blocking the redirect
    window.location.href = '/admin/signin';
    
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Even if there's an error, force redirect
    window.location.href = '/admin/signin';
  }
};

/**
 * Simple test logout function - just redirects without cleanup
 * Use this to test if the redirect issue is with the cleanup or the redirect itself
 */
export const testLogout = () => {
  console.log('🧪 Test logout - redirecting immediately...');
  window.location.href = '/admin/signin';
};

/**
 * Force logout with multiple redirect methods
 */
export const forceLogout = () => {
  console.log('💥 Force logout - trying multiple methods...');
  
  // Method 1: Direct assignment
  window.location.href = '/admin/signin';
  
  // Method 2: Replace (more aggressive)
  setTimeout(() => {
    window.location.replace('/admin/signin');
  }, 100);
  
  // Method 3: Nuclear option - reload and redirect
  setTimeout(() => {
    window.location.reload();
    setTimeout(() => {
      window.location.href = '/admin/signin';
    }, 100);
  }, 200);
};

/**
 * Nuclear logout - completely bypasses all logic and forces redirect
 * Use this if nothing else works
 */
export const nuclearLogout = () => {
  console.log('☢️ NUCLEAR LOGOUT - FORCING REDIRECT');
  
  // Clear everything immediately
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  // Force redirect using multiple methods
  try {
    // Method 1: Direct assignment
    window.location.href = '/admin/signin';
  } catch (e) {
    console.log('Method 1 failed, trying method 2');
    try {
      // Method 2: Replace
      window.location.replace('/admin/signin');
    } catch (e2) {
      console.log('Method 2 failed, trying method 3');
      try {
        // Method 3: Assign to top
        if (window.top) {
          window.top.location.href = '/admin/signin';
        } else {
          throw new Error('window.top is null');
        }
      } catch (e3) {
        console.log('All methods failed, using last resort');
        // Last resort: create a form and submit it
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = '/admin/signin';
        document.body.appendChild(form);
        form.submit();
      }
    }
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  return apiService.isAuthenticated();
};

/**
 * Get admin token
 */
export const getAdminToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

/**
 * Check authentication and redirect if not authenticated
 * Use this in admin pages to ensure user is logged in
 * Returns true if authenticated, false if not (and redirects)
 */
export const requireAdminAuth = (router: any): boolean => {
  // Add a small delay to prevent immediate redirect on page load
  setTimeout(() => {
    if (!isAdminAuthenticated()) {
      toast.error('Authentication required. Please login again.', {
        duration: 3000,
        position: 'top-center',
      });
      router.push('/admin/signin');
    }
  }, 100);
  
  return isAdminAuthenticated();
};

/**
 * Check authentication with loading state
 * Returns an object with loading and authenticated states
 */
export const checkAdminAuth = (): { loading: boolean; authenticated: boolean } => {
  // Check if we're in the browser
  if (typeof document === 'undefined') {
    return { loading: true, authenticated: false };
  }
  
  const token = getAdminToken();
  return { loading: false, authenticated: !!token };
};

/**
 * Clear all admin-related data (useful for cleanup)
 */
export const clearAdminData = (): void => {
  // Clear localStorage
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminSession');
  localStorage.removeItem('brandFormDraft');
  localStorage.removeItem('productFormDraft');
  
  // Clear cookies
  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

/**
 * Simple URL change test - just changes the URL without redirect
 */
export const testUrlChange = () => {
  console.log('🧪 Testing URL change...');
  
  // Try to change the URL directly
  try {
    // Method 1: History API
    window.history.pushState({}, '', '/admin/signin');
    console.log('✅ History API worked, URL changed to:', window.location.href);
    
    // Method 2: Force reload to the new URL
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ History API failed:', error);
    
    // Fallback: try direct assignment
    try {
      window.location.href = '/admin/signin';
    } catch (e2) {
      console.error('❌ Direct assignment also failed:', e2);
    }
  }
};
