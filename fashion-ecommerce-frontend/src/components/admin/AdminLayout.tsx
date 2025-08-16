"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkAdminAuth, adminLogout } from "@/lib/admin-auth";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ children, title = "Admin", description = "Admin Panel" }: AdminLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const { loading, authenticated } = checkAdminAuth();
      
      if (!loading) {
        setIsLoading(false);
        
        if (!authenticated) {
          toast.error('Authentication required. Please login again.', {
            duration: 3000,
            position: 'top-center',
          });
          router.push('/admin/signin');
          return;
        }
        
        setIsAuthenticated(true);
      }
    };

    // Check immediately
    checkAuth();
    
    // Also check after a short delay to ensure cookies are loaded
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
