"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  email: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const userData = getCookie('user');
    if (userData) {
      try {
        const user = JSON.parse(userData) as User;
        setUser(user);
      } catch {
        // Invalid user data, clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif text-white font-bold">TAD</h1>
              <p className="text-white/80 text-sm ml-4">TRENDS. ACCESS. DIVERSITY</p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-white/80 text-sm">Welcome, {user.email}</span>
                  <Button onClick={handleLogout} variant="outline" className="text-white border-white/30 hover:bg-white/10">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/auth/signin')} className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-12 rounded-2xl text-center max-w-2xl mx-4">
          <CardContent className="p-0">
            <h1 className="text-6xl font-serif text-white font-bold mb-6">
              Welcome to TAD
            </h1>
            <p className="text-white/80 text-xl mb-8">
              Your premier destination for fashion, trends, and style diversity.
            </p>
            <div className="space-y-4">
              <p className="text-white/60 text-lg">
                Discover the latest trends, explore diverse styles, and find your perfect look.
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => router.push('/auth/signup')}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 py-3 px-8 rounded-xl transition-all duration-200"
                  >
                    Create Account
                  </Button>
                </div>
              )}
              {user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button 
                    onClick={() => router.push('/customer/dashboard')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 py-3 px-8 rounded-xl transition-all duration-200"
                  >
                    Shop Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
