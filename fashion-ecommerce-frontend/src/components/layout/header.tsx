"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/lib/api";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  // Load user data from cookies and fetch counts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const userData = getCookie('user');
      if (userData) {
        try {
          let decodedUserData = userData;
          if (userData.startsWith('%')) {
            decodedUserData = decodeURIComponent(userData);
          }
          const user = JSON.parse(decodedUserData);
          setUser(user);
          
          // Fetch wishlist count from API for authenticated users
          if (user.id) {
            fetchWishlistCount(user.id);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Load cart count from localStorage (cart still uses localStorage)
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error loading cart count:', error);
      }
    }
  }, []);

  const fetchWishlistCount = async (userId: number) => {
    try {
      const response = await apiService.getFavorites(userId, 1, 1); // Just get count
      if (response && response.meta) {
        setWishlistCount(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      // Fallback to localStorage if API fails
      try {
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(wishlistItems.length);
      } catch (fallbackError) {
        console.error('Fallback wishlist count also failed:', fallbackError);
      }
    }
  };

  // Listen for storage changes to update counts in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error updating cart count:', error);
      }
    };

    const handleWishlistUpdate = () => {
      // Refresh wishlist count from API when updated
      if (user && user.id) {
        fetchWishlistCount(user.id);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events for same-tab updates
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  return (
    <header className="bg-gradient-to-r from-black via-purple-900 to-black border-b border-purple-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                TAD
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                Women
              </a>
              <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                Men
              </a>
              <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                Kids
              </a>
              <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                Sale
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  // Clear cookies and redirect
                  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                  window.location.href = '/';
                }}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-semibold"
              >
                Logout
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/auth/signin'}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-semibold"
              >
                Sign In
              </Button>
            )}
            <Link href="/wishlist" className="relative inline-flex">
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-purple-800/50 hover:text-amber-200">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart" className="relative inline-flex">
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-purple-800/50 hover:text-amber-200">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 