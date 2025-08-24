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
  Star,
  ArrowRight
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { apiService } from "@/lib/api";

// Interface for favorites API response
interface FavoriteItem {
  id: number;
  user_id: number;
  product_variant_id: number;
  created_at: string;
  product_variant: {
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
    product: {
      id: number;
      name: string;
      title: string;
      description: string;
      brand: {
        id: number;
        brand_name: string;
        business_name: string;
      };
      images: Array<{
        id: number;
        product_id: number;
        url: string;
        cloudinary_public_id: string | null;
      }>;
    };
  };
}

// Legacy interface for backward compatibility
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
  updated_at: string | null;
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
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [fullProductData, setFullProductData] = useState<{ [key: number]: FullProductData }>({});
  const [activeTab, setActiveTab] = useState('favourites');
  const [activeFilter, setActiveFilter] = useState('fashion');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user data from cookies
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
          
          // Fetch favorites for the authenticated user
          if (user.id) {
            fetchFavorites(user.id);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const fetchFavorites = async (userId: number) => {
    try {
      const response = await apiService.getFavorites(userId, 1, 100);
      console.log('Favorites API response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        console.log('Favorites data:', response.data);
        setFavoriteItems(response.data);
        
        // Fetch additional product data for each favorite item
        response.data.forEach((item: FavoriteItem) => {
          console.log('Processing favorite item:', item);
          fetchFullProductData(item.product_variant.product_id);
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setIsLoading(false);
    }
  };

  const fetchFullProductData = async (productId: number) => {
    try {
      // Use product variants API to get brand information
      const response = await apiService.getProductVariants(1, 100, productId);
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const variant = response.data[0] as any;
        if (variant.product && variant.product.brand) {
          const productData: FullProductData = {
            id: variant.product.id,
            name: variant.product.name || '',
            title: variant.product.title || '',
            description: variant.product.description || '',
            price: variant.product.price,
            salePrice: variant.product.salePrice,
            costPrice: variant.product.costPrice,
            brand: variant.product.brand,
            status: variant.product.status || '',
            images: [],
            category: null,
            category_id: variant.product.category_id || null,
            categoryLevel1: variant.product.categoryLevel1,
            categoryLevel2: variant.product.categoryLevel2,
            categoryLevel3: variant.product.categoryLevel3,
            categoryLevel4: variant.product.categoryLevel4,
            created_at: variant.product.created_at,
            updated_at: variant.product.updated_at,
            variants: [variant]
          };
          
          setFullProductData((prev: { [key: number]: FullProductData }) => ({
            ...prev,
            [productId]: productData
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching product variant data:', error);
    }
  };

  const removeFromWishlist = async (favoriteId: number) => {
    try {
      await apiService.removeFromFavorites(favoriteId);
      
      // Remove from local state
      const newFavorites = favoriteItems.filter(item => item.id !== favoriteId);
      setFavoriteItems(newFavorites);
      
      // Dispatch custom event to update header counts
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      
      console.log('Removed from favorites successfully');
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const addToCart = (item: FavoriteItem) => {
    // Add to cart logic here - you can implement this similar to the cart page
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
      // Get the first variant with a valid price
      const validVariant = fullData.variants.find(v => v.price && parseFloat(v.price) > 0);
      if (validVariant) {
        return parseFloat(validVariant.price);
      }
    }
    // Fallback to product price if no variants
    if (fullData && fullData.price) {
      return parseFloat(fullData.price);
    }
    return 0; // Fallback
  };

  // Helper function to get product image
  const getProductImage = (productId: number) => {
    // Get image from the favorites API response (which now includes images)
    const wishlistItem = favoriteItems.find(item => item.product_variant.product_id === productId);
    
    // Debug logging
    console.log('getProductImage called for productId:', productId);
    console.log('Found wishlistItem:', wishlistItem);
    
    if (wishlistItem && wishlistItem.product_variant.product.images && wishlistItem.product_variant.product.images.length > 0) {
      const imageUrl = wishlistItem.product_variant.product.images[0].url;
      console.log('Using image from wishlistItem:', imageUrl);
      
      // Handle relative URLs by prefixing with backend URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const fullImageUrl = `${backendUrl}${imageUrl}`;
        console.log('Converted relative URL to:', fullImageUrl);
        return fullImageUrl;
      }
      
      return imageUrl;
    }
    
    console.log('No image found, using fallback');
    // Fallback to default image
    return '/images/products/default-product.jpg';
  };

  // Helper function to get product name
  const getProductName = (productId: number) => {
    const fullData = fullProductData[productId];
    if (fullData && fullData.name) {
      return fullData.name;
    }
    // Fallback to the original name from wishlist item if no API data
    const wishlistItem = favoriteItems.find(item => item.product_variant.product_id === productId);
    if (wishlistItem && wishlistItem.product_variant.product.name) {
      return wishlistItem.product_variant.product.name;
    }
    return 'Product Name'; // Final fallback
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-6 text-amber-400 font-light text-lg">Loading your luxury wishlist...</p>
        </div>
      </div>
    );
  }

  // Check if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Heart className="h-24 w-24 mx-auto mb-6 text-amber-400" />
          <h1 className="text-3xl font-thin text-stone-800 mb-4">Sign in to view your wishlist</h1>
          <p className="text-stone-600 mb-8 font-light text-lg">Please sign in to access your saved items</p>
          <Button 
            onClick={() => router.push('/auth/signin')} 
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-8 py-3"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
        {favoriteItems.length === 0 ? (
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
            {favoriteItems.map((item, index) => {
              const productData = fullProductData[item.product_variant.product_id];
              const displayImage = getProductImage(item.product_variant.product_id);
              const displayName = getProductName(item.product_variant.product_id);
              const displayBrand = getBrandName(item.product_variant.product_id);
              const displayPrice = getPrice(item.product_variant.product_id);
              
              return (
                <div 
                  key={item.id} 
                  className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-purple-600 hover:border-purple-500 hover:shadow-purple-500/30"
                  onClick={() => router.push(`/product/${item.product_variant.product_id}`)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-stone-50 to-neutral-50">
                    <Image
                      src={displayImage}
                      alt={displayName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Status Badge */}
                    {getStatusBadge('available')}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/95 hover:bg-white border border-stone-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.id);
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
                        {displayBrand}
                      </p>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-stone-800 mb-3 line-clamp-2 group-hover:text-stone-900 transition-colors duration-200 flex items-center">
                      {displayName}
                      <ArrowRight className="h-4 w-4 ml-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                    </h3>
                    <p className="text-xs text-purple-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to view product details
                    </p>
                    
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
                        ${displayPrice.toFixed(2)}
                      </span>
                      {item.product_variant.size && (
                        <span className="text-sm text-stone-500">Size: {item.product_variant.size.name}</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
