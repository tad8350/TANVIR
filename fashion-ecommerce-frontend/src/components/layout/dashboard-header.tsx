"use client";

import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardHeader() {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 text-gray-600 text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>B Pornewhy solarchoya for compines</span>
          <div className="flex space-x-4">
            <span>Sales | Alti you a prpresicsy regning</span>
            <span>Cantce | Alnouer | Dow Outones</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold">TAD</div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input 
                  placeholder="Clance try Home"
                  className="bg-white text-gray-800 rounded-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Icons */}
            <div className="flex space-x-4">
              <User className="h-6 w-6 cursor-pointer hover:text-gray-300" />
              <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-gray-300" />
              <Heart className="h-6 w-6 cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#F5F5DC] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-3">
            <span className="text-gray-800 font-medium cursor-pointer hover:text-[#8B0000]">Men</span>
            <span className="text-gray-800 font-medium cursor-pointer hover:text-[#8B0000]">Women</span>
            <span className="text-gray-800 font-medium cursor-pointer hover:text-[#8B0000]">Kids</span>
            <span className="text-gray-800 font-medium cursor-pointer hover:text-[#8B0000]">Kids</span>
          </div>
        </div>
      </nav>
    </>
  );
} 