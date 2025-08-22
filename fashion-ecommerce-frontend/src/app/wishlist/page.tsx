"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  MoreHorizontal, 
  X, 
  ArrowLeft,
  Star
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { apiService } from "@/lib/api";

interface WishlistItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  brand?: string;
  size?: string;
  status?: 'available' | 'sold-out' | 'deal';
}

// New interface for full product data
interface FullProductData {
  id: number;
  name: string;
  title: string;
  description: string;
  price: string | null;
  salePrice: string | null;
  costPrice: string | null;
  brand: string | { 
    id: number;
    brand_name: string;
    business_name: string;
    category: string;
    description: string;
    logo_url: string | null;
    logo_cloudinary_id: string | null;
    banner_url: string | null;
    banner_cloudinary_id: string | null;
    website_url: string;
    contact_email: string;
    phone_number: string;
    address: string | null;
    region: string | null;
    district: string | null;
    business_license: string;
    tax_id: string;
    commission_rate: string;
    contact_person: string;
    phone: string;
    website: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  status: string;
  images: Array<{
    id: number;
    product_id: number;
    url: string;
    cloudinary_public_id: string | null;
  }>;
  category: string | null;
  category_id: number | null;
  categoryLevel1: string | null;
  categoryLevel2: string | null;
  categoryLevel3: string | null;
  categoryLevel4: string | null;
  created_at: string | null;
  updated_at: string;
  variants?: Array<{
    id: number;
    product_id: number;
    color_id: number;
    size_id: number;
    stock: number;
    lowStockThreshold: number;
    price: string;
    discount_price: string;
    sku: string;
    is_active: boolean;
    color: {
      id: number;
      name: string;
      created_at: string;
    };
    size: {
      id: number;
      name: string;
      created_at: string;
    };
  }>;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [fullProductData, setFullProductData] = useState<{ [key: number]: FullProductData }>({});
  const [activeTab, setActiveTab] = useState('favourites');
  const [activeFilter, setActiveFilter] = useState('fashion');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load wishlist items from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistItems(items);
          
          // Fetch full product data for each wishlist item
          items.forEach((item: WishlistItem) => {
            fetchFullProductData(item.productId);
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchFullProductData = async (productId: number) => {
    try {
      const response = await apiService.getProduct(productId);
      if (response && response.data && typeof response.data === 'object' && 'id' in response.data) {
        setFullProductData(prev => ({
          ...prev,
          [productId]: response.data as FullProductData
        }));
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const removeFromWishlist = (productId: number) => {
    const newWishlist = wishlistItems.filter(item => item.productId !== productId);
    setWishlistItems(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    // Remove from full product data
    setFullProductData(prev => {
      const newData = { ...prev };
      delete newData[productId];
      return newData;
    });
    
    // Dispatch custom event to update header counts
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic here
    console.log('Adding to cart:', item);
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'deal':
        return <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold">Deal</Badge>;
      case 'sold-out':
        return <Badge className="bg-stone-500 text-white text-xs">Sold out</Badge>;
      default:
        return null;
    }
  };

  // Helper function to get correct brand name
  const getBrandName = (productId: number) => {
    const fullData = fullProductData[productId];
    if (fullData && fullData.brand) {
      if (typeof fullData.brand === 'string') {
        return fullData.brand;
      } else if (fullData.brand.brand_name) {
        return fullData.brand.brand_name;
      }
    }
    return 'Brand'; // Fallback
  };

  // Helper function to get correct price
  const getPrice = (productId: number) => {
    const fullData = fullProductData[productId];
    if (fullData && fullData.variants && fullData.variants.length > 0) {
      const prices = fullData.variants.map(v => parseFloat(v.price || '0'));
      return Math.min(...prices);
    }
    return 0; // Fallback
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
      <Header />
      
      {/* Luxury Header Section - WHITE BACKGROUND WITH PURPLE TEXT */}
      <header className="bg-white border-b border-purple-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-thin text-purple-800 mb-4">Your Wishlist</h1>
            <p className="text-2xl text-purple-600 max-w-3xl mx-auto font-light">
              Curated collection of your favorite luxury items
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Primary Tabs - UPDATED TO MATCH PRODUCT PAGE STYLE */}
        <div className="flex space-x-1 mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-stone-200">
          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'favourites'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/70'
            }`}
          >
            Favourites
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'boards'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/70'
            }`}
          >
            Boards
          </button>
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'owned'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/70'
            }`}
          >
            Owned
          </button>
        </div>

        {/* Secondary Filter Tabs - UPDATED TO MATCH PRODUCT PAGE STYLE */}
        <div className="flex space-x-2 mb-10">
          <button
            onClick={() => setActiveFilter('fashion')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'fashion'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200'
            }`}
          >
            Fashion
          </button>
          <button
            onClick={() => setActiveFilter('beauty')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'beauty'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200'
            }`}
          >
            Beauty
          </button>
          <button
            onClick={() => setActiveFilter('outfits')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'outfits'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200'
            }`}
          >
            Outfits
          </button>
        </div>

        {/* Product Grid - UPDATED TO MATCH PRODUCT PAGE STYLE */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-6"></div>
            <p className="text-amber-400 font-light text-lg">Loading your luxury wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-24 w-24 mx-auto mb-6 text-amber-400" />
            <h2 className="text-3xl font-thin text-stone-800 mb-4">Your wishlist is empty</h2>
            <p className="text-stone-600 mb-8 font-light text-lg">Start adding luxury items you love to your wishlist</p>
            <Button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item, index) => (
              <div 
                key={item.productId} 
                className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-purple-600 hover:border-purple-500 hover:shadow-purple-500/30"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-stone-50 to-neutral-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  {getStatusBadge(item.status)}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/95 hover:bg-white border border-stone-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.productId);
                      }}
                    >
                      <X className="h-4 w-4 text-stone-600" />
                    </Button>
                  </div>
                  
                  {/* Bottom Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/95 hover:bg-white border border-stone-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <MoreHorizontal className="h-4 w-4 text-stone-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/95 hover:bg-white border border-stone-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 text-stone-600" />
                    </Button>
                  </div>
                </div>

                {/* Product Info - MATCHING PRODUCT PAGE STYLE WITH CORRECT BRAND NAME */}
                <div className="p-6">
                  <div className="mb-3">
                    <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                      {getBrandName(item.productId)}
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-stone-800 mb-3 line-clamp-2 group-hover:text-stone-900 transition-colors duration-200">
                    {item.name}
                  </h3>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < 4 ? 'text-amber-400 fill-current' : 'text-stone-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      (128)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-stone-800">
                      ${getPrice(item.productId).toFixed(2)}
                    </span>
                    {item.size && (
                      <span className="text-sm text-stone-500">Size: {item.size}</span>
                    )}
                  </div>
                  
                  {/* Additional Features */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-stone-100 to-neutral-100 text-stone-700 text-xs font-medium rounded-full border border-stone-200">
                      Free Shipping
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
