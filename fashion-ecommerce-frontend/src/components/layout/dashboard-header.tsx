"use client";

import { Search, ShoppingCart, User, Heart, LogOut, Settings, UserCheck, Package, HelpCircle, LogIn, UserPlus, Menu, X, Diamond, Crown, Gem } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

export default function DashboardHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
            <span className="font-semibold">Track Order</span>
          </div>
        </div>
      </div>

      {/* Main Header - LIGHT THEME */}
      <header className="bg-white shadow-lg border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/25">
                <span className="text-white font-bold text-3xl">T</span>
              </div>
              <div className="text-4xl font-thin bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                TAD
              </div>
            </div>
            
            {/* Search Bar - Light Design */}
            <div className="flex-1 max-w-2xl mx-16 hidden lg:block">
              <div className="relative">
                <Input 
                  placeholder="Search luxury collections..."
                  className="bg-purple-50 text-purple-900 rounded-none border-purple-300 focus:border-purple-500 focus:ring-purple-500 py-4 px-6 font-light placeholder-purple-600"
                />
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-purple-500 h-5 w-5" />
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
                      {isLoggedIn ? (
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
                            <a href="#" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <UserCheck className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">My Profile</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Package className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">My Orders</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Heart className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Settings className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Settings</span>
                            </a>
                          </div>
                          
                          <div className="border-t border-purple-200 pt-3">
                            <a href="#" className="flex items-center px-8 py-4 text-red-600 hover:bg-red-50 transition-colors duration-200">
                              <LogOut className="h-5 w-5 mr-4" />
                              <span className="text-sm font-medium">Sign Out</span>
                            </a>
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
                            <a href="/auth/signin" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <LogIn className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Sign In</span>
                            </a>
                            
                            <a href="/auth/signup" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <UserPlus className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Create Account</span>
                            </a>
                          </div>
                          
                          <div className="border-t border-purple-200 pt-3">
                            <a href="#" className="flex items-center px-8 py-4 text-purple-700 hover:bg-purple-50 transition-colors duration-200 hover:text-purple-900">
                              <Heart className="h-5 w-5 mr-4 text-purple-500" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <ShoppingCart className="h-7 w-7 cursor-pointer hover:text-purple-600 text-purple-700 transition-colors duration-200" />
              <Heart className="h-7 w-7 cursor-pointer hover:text-purple-600 text-purple-700 transition-colors duration-200" />
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