"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load counts from localStorage
    if (typeof window !== 'undefined') {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error('Error loading counts:', error);
      }
    }
  }, []);

  // Load user data from cookies
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
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  // Listen for storage changes to update counts in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error('Error updating counts:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events for same-tab updates
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, []);

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