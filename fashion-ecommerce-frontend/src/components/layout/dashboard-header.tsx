"use client";

import { Search, ShoppingCart, User, Heart, LogOut, Settings, UserCheck, Package, HelpCircle, LogIn, UserPlus, Menu, X, Diamond, Crown, Gem } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  isAuthenticated?: boolean;
  user?: any;
  cartCount?: number;
  wishlistCount?: number;
  onSignOut?: () => void;
}

export default function DashboardHeader({ isAuthenticated = false, user, cartCount = 0, wishlistCount = 0, onSignOut }: DashboardHeaderProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSignOut = () => {
    // Clear all authentication-related cookies
    const cookies = ['user', 'token', 'auth', 'session', 'refresh'];
    cookies.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    }
    
    // Call parent callback to update state
    if (onSignOut) {
      onSignOut();
    }
    
    // Close menu
    setShowProfileMenu(false);
    
    // Show success message
    console.log('Signout successful');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* Top Bar - LIGHT THEME WITH PURPLE */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-xs py-3 border-b border-purple-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-8 mb-2 sm:mb-0">
            <span className="flex items-center font-semibold">
              <Diamond className="h-4 w-4 mr-2" />
              Authenticity Guaranteed
            </span>
            <span className="flex items-center font-semibold">
              <Crown className="h-4 w-4 mr-2" />
              VIP Experience
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <span className="hidden sm:inline font-semibold">Elite Support</span>
            <span className="hidden sm:inline text-white/80">|</span>
            <span className="font-semibold cursor-pointer hover:text-purple-200 transition-colors duration-200">Track Order</span>
          </div>
        </div>
      </div>

      {/* Main Header - LIGHT THEME */}
      <header className="bg-white shadow-lg border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Clean Luxury Design */}
            <div className="flex items-center space-x-8 flex-1 justify-center">
              {/* Premium Logo Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg cursor-pointer" onClick={() => router.push('/dashboard')}>
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              
              {/* Brand Text */}
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push('/dashboard')}>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  TAD
                </div>
                <div className="text-gray-400 text-2xl">•</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  The Apparel District
                </div>
              </div>
            </div>
            
            {/* Icons - Light Design */}
            <div className="flex items-center space-x-8">
              <div className="relative" ref={menuRef}>
                <User 
                  className="h-7 w-7 cursor-pointer hover:text-purple-600 transition-colors duration-200 text-purple-700" 
                  onClick={handleProfileClick}
                />
                
                {/* Profile Dropdown Menu - Light Design */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-purple-200 z-50">
                    <div className="py-3">
                      {isAuthenticated ? (
                        // Logged in user menu
                        <>
                          <div className="px-8 py-6 border-b border-purple-200">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <p className="text-purple-900 font-semibold text-lg">Welcome back!</p>
                                <p className="text-purple-600 text-sm font-medium">VIP Member</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="py-3">
                            <button onClick={() => handleNavigation('/dashboard')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <UserCheck className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">My Profile</span>
                            </button>
                            
                            <button onClick={() => handleNavigation('/orders')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Package className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">My Orders</span>
                            </button>
                            
                            <button onClick={() => handleNavigation('/wishlist')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Heart className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </button>
                            
                            <button onClick={() => handleNavigation('/cart')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <ShoppingCart className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Shopping Cart</span>
                            </button>
                            
                            <button onClick={() => handleNavigation('/settings')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Settings className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Settings</span>
                            </button>
                          </div>
                          
                          <div className="border-t border-purple-200 pt-3">
                            <button onClick={handleSignOut} className="w-full text-left flex items-center px-8 py-4 text-red-600 hover:bg-red-50 transition-colors duration-200">
                              <LogOut className="h-5 w-5 mr-4" />
                              <span className="text-sm font-medium">Sign Out</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        // Guest user menu
                        <>
                          <div className="px-8 py-6 border-b border-purple-200">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <p className="text-purple-900 font-semibold text-lg">Welcome to TAD</p>
                                <p className="text-purple-600 text-sm font-medium">Join our luxury community</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="py-3">
                            <button onClick={() => handleNavigation('/auth/signin')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <LogIn className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Sign In</span>
                            </button>
                            
                            <button onClick={() => handleNavigation('/auth/signup')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <UserPlus className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Create Account</span>
                            </button>
                          </div>
                          
                          <div className="border-t border-purple-200 pt-3">
                            <button onClick={() => handleNavigation('/wishlist')} className="w-full text-left flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Heart className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button onClick={() => handleNavigation('/cart')} className="relative">
                <ShoppingCart className="h-7 w-7 cursor-pointer hover:text-purple-600 text-purple-700 transition-colors duration-200" />
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button onClick={() => handleNavigation('/wishlist')} className="relative">
                <Heart className="h-7 w-7 cursor-pointer hover:text-purple-600 text-purple-700 transition-colors duration-200" />
                {isAuthenticated && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Light Theme */}
        <nav className="bg-white border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-6">
              <div className="flex space-x-10">
                <span className="text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Haute Couture</span>
                <span className="text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Designer Bags</span>
                <span className="text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Luxury Watches</span>
                <span className="text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Fine Jewelry</span>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-purple-700 hover:text-purple-600 transition-colors duration-200"
              >
                {showMobileMenu ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-b border-purple-200">
            <div className="px-4 py-6 space-y-4">
              <span className="block text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Haute Couture</span>
              <span className="block text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Designer Bags</span>
              <span className="block text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Luxury Watches</span>
              <span className="block text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors duration-200 text-lg">Fine Jewelry</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
} 