"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/header";

interface User {
  id: number;
  email: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Get user data from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const checkUser = () => {
      const userData = getCookie('user');
      const tokenData = getCookie('token');
      
      if (userData && tokenData) {
        try {
          // Decode URL-encoded cookie value if needed
          let decodedUserData = userData;
          if (userData.startsWith('%')) {
            decodedUserData = decodeURIComponent(userData);
          }
          
          const user = JSON.parse(decodedUserData) as User;
          setUser(user);
          // Show welcome message if user was just logged in
          if (!showWelcomeMessage) {
            setShowWelcomeMessage(true);
            setTimeout(() => setShowWelcomeMessage(false), 5000); // Hide after 5 seconds
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          console.error('Raw user data:', userData);
          // Invalid user data, clear cookies
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false); // Mark as loaded
    };

    // Check immediately
    checkUser();

    // If we have auth=success parameter, check more frequently
    if (searchParams.get('auth') === 'success') {
      // Check immediately and then every 100ms for the first second
      const immediateCheck = setTimeout(checkUser, 0);
      const check1 = setTimeout(checkUser, 100);
      const check2 = setTimeout(checkUser, 200);
      const check3 = setTimeout(checkUser, 300);
      const check4 = setTimeout(checkUser, 400);
      const check5 = setTimeout(checkUser, 500);
      const check6 = setTimeout(checkUser, 600);
      const check7 = setTimeout(checkUser, 700);
      const check8 = setTimeout(checkUser, 800);
      const check9 = setTimeout(checkUser, 900);
      const check10 = setTimeout(checkUser, 1000);
      
      return () => {
        clearTimeout(immediateCheck);
        clearTimeout(check1);
        clearTimeout(check2);
        clearTimeout(check3);
        clearTimeout(check4);
        clearTimeout(check5);
        clearTimeout(check6);
        clearTimeout(check7);
        clearTimeout(check8);
        clearTimeout(check9);
        clearTimeout(check10);
      };
    }

    // Regular checks for non-auth-success cases
    const timer1 = setTimeout(checkUser, 500);
    const timer2 = setTimeout(checkUser, 1000);
    const timer3 = setTimeout(checkUser, 2000);
    const timer4 = setTimeout(checkUser, 3000);
    const timer5 = setTimeout(checkUser, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [showWelcomeMessage, searchParams]);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    // Clear the user state
    setUser(null);
    setShowWelcomeMessage(false);
    // Show logout message with shorter duration and non-blocking
    toast.success('Successfully logged out!', {
      duration: 3000, // Show for only 3 seconds
      dismissible: true, // Allow manual dismissal
      action: {
        label: 'Dismiss',
        onClick: () => toast.dismiss(),
      },
      position: 'top-center', // Position in center-top instead of top-right
    });
  };

  // Show loading state while checking user
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-white-800 to-white-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-white-800 to-white-900">
      <Header />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-12 rounded-2xl text-center max-w-2xl mx-4">
          <CardContent className="p-0">
            {showWelcomeMessage && user && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                <p className="text-green-300 text-lg">
                  🎉 Welcome back, {user.email}! You've successfully signed in.
                </p>
              </div>
            )}
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  View New Dashboard
                </Button>
                {user && (
                  <>
                    <Button 
                      onClick={() => router.push('/customer/dashboard')}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      onClick={() => router.push('/shop')}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Shop Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
