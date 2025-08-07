"use client";

import { Search, ShoppingCart, User, Heart, LogOut, Settings, UserCheck, Package, HelpCircle, LogIn, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

export default function DashboardHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context
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

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 text-gray-600 text-xs py-1">
        <div className="max-w-[95%] mx-auto px-4 flex justify-between items-center">
          <span>B Pornewhy solarchoya for compines</span>
          <div className="flex space-x-4">
            <span>Sales | Alti you a prpresicsy regning</span>
            <span>Cantce | Alnouer | Dow Outones</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#cfb899] text-black">
        <div className="max-w-[95%] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold text-black">TAD</div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input 
                  placeholder="Search for products, brands & more"
                  className="bg-white text-gray-800 rounded-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              </div>
            </div>
            
            {/* Icons */}
            <div className="flex space-x-4">
              <div className="relative" ref={menuRef}>
                <User 
                  className="h-6 w-6 cursor-pointer hover:text-gray-700 transition-colors duration-200 text-black" 
                  onClick={handleProfileClick}
                />
                
                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      {isLoggedIn ? (
                        // Logged in user menu
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#cfb899] rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-black" />
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold text-sm">Welcome back!</p>
                                <p className="text-gray-500 text-xs">Signed in as user@example.com</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="py-1">
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <UserCheck className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">My Profile</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <Package className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">My Orders</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <Heart className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <Settings className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Settings</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <HelpCircle className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Help & Support</span>
                            </a>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-1">
                            <a href="#" className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200">
                              <LogOut className="h-4 w-4 mr-3" />
                              <span className="text-sm font-medium">Sign Out</span>
                            </a>
                          </div>
                        </>
                      ) : (
                        // Guest user menu
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold text-sm">Welcome to TAD</p>
                                <p className="text-gray-500 text-xs">Sign in to access your account</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="py-1">
                            <a href="/auth/signin" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <LogIn className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Sign In</span>
                            </a>
                            
                            <a href="/auth/signup" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <UserPlus className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Create Account</span>
                            </a>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-1">
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <Heart className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Wishlist</span>
                            </a>
                            
                            <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                              <HelpCircle className="h-4 w-4 mr-3 text-[#cfb899]" />
                              <span className="text-sm font-medium">Help & Support</span>
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-gray-700 text-black" />
              <Heart className="h-6 w-6 cursor-pointer hover:text-gray-700 text-black" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#cfb899] border-b border-gray-200">
        <div className="max-w-[95%] mx-auto px-4">
          <div className="flex space-x-8 py-3">
            <span className="text-black font-medium cursor-pointer hover:text-gray-700">Men</span>
            <span className="text-black font-medium cursor-pointer hover:text-gray-700">Women</span>
            <span className="text-black font-medium cursor-pointer hover:text-gray-700">Kids</span>
          </div>
        </div>
      </nav>
    </>
  );
} 