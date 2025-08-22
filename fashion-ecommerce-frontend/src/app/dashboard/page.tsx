"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, Star, ShoppingCart, Heart, ArrowRight, 
  TrendingUp, Sparkles, Search, Filter, Grid3X3, List, 
  Clock, Award, Users, ShoppingBag, Eye, ThumbsUp, 
  Shield, Truck, RefreshCw, Crown, ArrowUpRight, Play,
  Diamond, Gem, Zap, Star as StarIcon
} from "lucide-react";
import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardFooter from "@/components/layout/dashboard-footer";
import ProductCard from "@/components/ui/product-card";
import { apiService } from "@/lib/api";
import Image from 'next/image';

// Define types for the dashboard
interface Product {
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

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Luxury brand data
  const luxuryBrands = [
    { name: "TAD Collection", description: "Premium fashion essentials", image: "/images/brand1.jpg" },
    { name: "Elite Style", description: "Contemporary luxury", image: "/images/brand2.jpg" },
    { name: "Modern Elegance", description: "Sophisticated designs", image: "/images/brand3.jpg" },
    { name: "Premium Craft", description: "Artisanal quality", image: "/images/brand4.jpg" }
  ];

  const categories = [
    { name: "Haute Couture", icon: "👑", count: "Exclusive", color: "from-purple-600 to-purple-800" },
    { name: "Designer Bags", icon: "👜", count: "Limited", color: "from-indigo-600 to-indigo-800" },
    { name: "Luxury Watches", icon: "⌚", count: "Premium", color: "from-purple-700 to-purple-900" },
    { name: "Fine Jewelry", icon: "💎", count: "Rare", color: "from-indigo-700 to-indigo-900" }
  ];

  const features = [
    { icon: Diamond, title: "Exclusive Access", description: "VIP-only collections and early releases" },
    { icon: Crown, title: "Heritage Quality", description: "Centuries-old craftsmanship traditions" },
    { icon: Gem, title: "Rare Materials", description: "Finest materials from around the world" },
    { icon: StarIcon, title: "Celebrity Style", description: "Worn by fashion icons and celebrities" }
  ];

  const stats = [
    { label: "Exclusive Products", value: "5K+", icon: Diamond },
    { label: "Luxury Brands", value: "25+", icon: Crown },
    { label: "VIP Members", value: "10K+", icon: Gem },
    { label: "Global Boutiques", value: "15+", icon: StarIcon }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsData = await apiService.getProducts(1, 20);
        console.log('Products data:', productsData);
        
        if (productsData && productsData.data && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else if (productsData && Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.log('No products found, setting empty array');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // For now, we'll do client-side search since the backend search API might not be ready
      const filtered = products.filter(product => {
        const searchTerm = query.toLowerCase();
        const productName = (product.name || product.title || '').toLowerCase();
        const brandName = typeof product.brand === 'string' 
          ? product.brand.toLowerCase() 
          : (product.brand?.brand_name || '').toLowerCase();
        const category = (product.categoryLevel1 || product.category || '').toLowerCase();
        
        return productName.includes(searchTerm) || 
               brandName.includes(searchTerm) || 
               category.includes(searchTerm);
      });
      
      setSearchResults(filtered);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Real-time search as user types
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Debounce the search to avoid too many searches while typing
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchQuery);
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Generate search suggestions based on available products
  const generateSearchSuggestions = () => {
    const suggestions = new Set<string>();
    
    // Add brand names
    products.forEach(product => {
      if (typeof product.brand === 'string') {
        suggestions.add(product.brand);
      } else if (product.brand?.brand_name) {
        suggestions.add(product.brand.brand_name);
      }
    });
    
    // Add category names
    products.forEach(product => {
      if (product.categoryLevel1) {
        suggestions.add(product.categoryLevel1);
      }
      if (product.categoryLevel2) {
        suggestions.add(product.categoryLevel2);
      }
    });
    
    // Add popular product names (first few words)
    products.forEach(product => {
      const name = product.name || product.title || '';
      const words = name.split(' ').slice(0, 2).join(' ');
      if (words.length > 2) {
        suggestions.add(words);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  };

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    if (searchQuery.trim().length < 2) {
      setSearchSuggestions(generateSearchSuggestions());
      setShowSuggestions(true);
    }
  };

  // Hide suggestions when clicking outside
  const handleInputBlur = () => {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Transform products for display
  const transformProductForDisplay = (product: Product) => {
    try {
      let brandName = 'Unknown Brand';
      if (typeof product.brand === 'string') {
        brandName = product.brand;
      } else if (product.brand && typeof product.brand === 'object') {
        brandName = (product.brand as any).brand_name || (product.brand as any).name || 'Unknown Brand';
      }

      let price = 0;
      let discountPrice = 0;
      if (product.variants && product.variants.length > 0) {
        const prices = product.variants.map((v: any) => parseFloat(v.price || '0'));
        const discountPrices = product.variants.map((v: any) => parseFloat(v.discount_price || '0'));
        price = Math.min(...prices);
        discountPrice = Math.min(...discountPrices.filter((p: number) => p > 0));
      }

      let category = 'Uncategorized';
      if (product.categoryLevel1) {
        category = product.categoryLevel1;
        if (product.categoryLevel2) {
          category += ` > ${product.categoryLevel2}`;
        }
      }

      let imageUrl = '/images/placeholder-product.jpg';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].url;
      }

      let tag: string | undefined = undefined;
      let tagColor: string | undefined = undefined;
      
      if (discountPrice > 0) {
        tag = "EXCLUSIVE";
        tagColor = "bg-gradient-to-r from-amber-500 to-orange-500";
      } else if (product.created_at) {
        const daysSinceCreated = Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated <= 7) {
          tag = "NEW ARRIVAL";
          tagColor = "bg-gradient-to-r from-emerald-500 to-teal-500";
        }
      }

      return {
        id: product.id,
        name: product.name || product.title || 'Unknown Product',
        price: `$${price.toFixed(2)}`,
        originalPrice: discountPrice > 0 ? `$${discountPrice.toFixed(2)}` : undefined,
        image: imageUrl,
        tag,
        tagColor,
        rating: 4.9, // Luxury rating
        reviews: Math.floor(Math.random() * 30) + 150, // Premium review count
        brand: brandName,
        category: category
      };
    } catch (error) {
      console.error('Error transforming product:', product.id, error);
      return {
        id: product.id,
        name: product.name || product.title || 'Unknown Product',
        price: '$0.00',
        originalPrice: undefined,
        image: '/images/placeholder-product.jpg',
        tag: undefined,
        tagColor: undefined,
        rating: 0,
        reviews: 0,
        brand: 'Unknown Brand',
        category: 'Uncategorized'
      };
    }
  };

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "Featured") {
      return products.slice(0, 8);
    } else if (activeTab === "New") {
      return products.filter(p => p.created_at && 
        Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)) <= 7
      ).slice(0, 8);
    } else if (activeTab === "Exclusive") {
      return products.slice(0, 8); // Mock exclusive
    }
    return products;
  }, [products, activeTab]);

  // Add navigation function
  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[48vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
            <p className="mt-5 text-amber-400 font-light text-base">Curating luxury collection...</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[48vh]">
          <div className="text-center">
            <div className="text-amber-400 text-xl mb-5">💎</div>
            <p className="text-amber-400 text-lg">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-5 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2">
              Try Again
            </Button>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardHeader />

      {/* Hero Section - REDUCED BY 20% */}
      <section className="relative bg-gradient-to-br from-black via-purple-900 to-black text-white py-24 overflow-hidden">
        {/* Animated background elements - REDUCED */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium badge - REDUCED */}
            <div className="inline-flex items-center bg-gradient-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-amber-400/30">
              <Diamond className="h-5 w-5 mr-2 text-amber-400" />
              <span className="text-xs font-light tracking-widest uppercase text-amber-400">PREMIUM COLLECTION</span>
            </div>
            
            {/* Main headline - REDUCED */}
            <h1 className="text-6xl md:text-7xl font-thin mb-8 leading-none tracking-tight">
              Welcome to <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">TAD</span>
            </h1>
            
            {/* Subtitle - REDUCED */}
            <p className="text-2xl md:text-3xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed font-light text-gray-200">
              Where <span className="text-amber-400 font-medium">luxury</span> meets <span className="text-purple-400 font-medium">innovation</span>. 
              Discover our curated collection of <span className="text-pink-400 font-medium">exclusive</span> fashion, 
              crafted with <span className="text-emerald-400 font-medium">uncompromising</span> quality.
            </p>
            
            {/* Search Bar - IMPLEMENTED */}
            <div className="mb-12">
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for luxury products, brands, or categories..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-amber-400/30 rounded-full text-white placeholder-amber-200/70 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all duration-300 text-lg font-light"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25">
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mx-auto"></div>
                      ) : (
                        'Search'
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-400/30 shadow-2xl shadow-amber-500/25 z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2 px-3">Popular Searches</div>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-all duration-200 text-sm font-light"
                        >
                          <Search className="inline h-3 w-3 mr-2 text-amber-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* CTA Buttons - REDUCED */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold py-5 px-10 rounded-none border-0 transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-amber-500/25"
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                Explore Collection
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black py-5 px-10 rounded-none transition-all duration-300 transform hover:scale-110 font-bold"
              >
                <TrendingUp className="mr-2 h-6 w-6" />
                View Trends
              </Button>
            </div>

            {/* Luxury Stats - REDUCED */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-thin text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs opacity-80 tracking-widest uppercase text-gray-300 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section - IMPLEMENTED */}
      {showSearchResults && (
        <section className="py-16 bg-gradient-to-b from-white via-neutral-50 to-stone-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-thin text-stone-800 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-lg text-stone-600 font-light">
                  Found {searchResults.length} luxury products
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Back to All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Clear Search
                </Button>
              </div>
            </div>
            
            {isSearching ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-amber-600 font-light text-lg">Searching luxury collection...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-amber-500 text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-light text-stone-700 mb-3">No Results Found</h3>
                <p className="text-stone-500 font-light text-lg mb-6">Try adjusting your search terms or browse our featured collection</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                  <span className="text-xs text-stone-400 font-light">Popular searches:</span>
                  {generateSearchSuggestions().slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => {
                  const displayProduct = transformProductForDisplay(product);
                  return (
                    <div 
                      key={product.id} 
                      className="group cursor-pointer bg-gradient-to-br from-black via-purple-900 to-black rounded-2xl overflow-hidden hover:bg-gradient-to-br hover:from-black hover:via-purple-800 hover:to-black hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-stone-50 to-neutral-50">
                        <img
                          src={displayProduct.image}
                          alt={displayProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Quick Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
                          <button 
                            className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 border border-purple-200"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="h-3 w-3 text-purple-600" />
                          </button>
                          <button 
                            className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 border border-purple-200"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Eye className="h-3 w-3 text-purple-600" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-3">
                        {/* Brand & Category */}
                        <div className="mb-1">
                          <p className="text-xs font-medium text-purple-200 uppercase tracking-wide mb-1">
                            {displayProduct.brand}
                          </p>
                          <p className="text-xs text-purple-300 font-light">
                            {displayProduct.category}
                          </p>
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-amber-200 transition-colors duration-200">
                          {displayProduct.name}
                        </h3>
                        
                        {/* Rating & Reviews */}
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2 w-2 ${i < Math.floor(displayProduct.rating) ? 'text-amber-400 fill-current' : 'text-purple-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-purple-200 font-medium">
                            ({displayProduct.reviews})
                          </span>
                        </div>
                        
                        {/* Price Section */}
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-white">
                            {displayProduct.price}
                          </span>
                          <button 
                            className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Luxury Features Section - REDUCED */}
      <section className="py-20 bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-thin text-stone-800 mb-5">Why Choose TAD</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Experience luxury redefined with our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-black via-purple-900 to-black backdrop-blur-sm hover:bg-gradient-to-br hover:from-black hover:via-purple-800 hover:to-black hover:shadow-2xl transition-all duration-500 group border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 border-2 border-amber-200 group-hover:border-amber-400 shadow-lg">
                  <feature.icon className="h-10 w-10 text-amber-700 group-hover:text-amber-800 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-200 transition-colors duration-300">{feature.title}</h3>
                <p className="text-purple-200 font-light leading-relaxed text-base group-hover:text-purple-100 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Categories Section - REDUCED */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 via-stone-50 to-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-thin text-stone-800 mb-5">Curated Collections</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Discover our meticulously curated luxury categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="group cursor-pointer text-center p-8 rounded-2xl bg-gradient-to-br from-black via-purple-900 to-black backdrop-blur-sm hover:bg-gradient-to-br hover:from-black hover:via-purple-800 hover:to-black hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg border-2 border-amber-200 group-hover:border-amber-400">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-200 transition-colors duration-300">{category.name}</h3>
                <p className="text-amber-400 font-medium text-base group-hover:text-amber-300 transition-colors duration-300">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Products Section - REDUCED */}
      <section className="py-20 bg-gradient-to-b from-zinc-50 via-neutral-50 to-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-thin text-stone-800 mb-3">
                {activeTab} Collection
              </h2>
              <p className="text-xl text-stone-600 font-light">
                Handpicked luxury items for the discerning customer
              </p>
            </div>
            
            <div className="flex items-center space-x-5 mt-6 lg:mt-0">
              {/* View Mode Toggle - REDUCED */}
              <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-purple-600 text-white" : "text-purple-700 hover:text-purple-900"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-purple-600 text-white" : "text-purple-700 hover:text-purple-900"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Luxury Tab Buttons - REDUCED */}
              <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200">
                <Button
                  variant={activeTab === "Featured" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("Featured")}
                  className="rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-3 py-1"
                >
                  Featured
                </Button>
                <Button
                  variant={activeTab === "New" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("New")}
                  className="rounded-md text-purple-700 hover:text-purple-900 hover:bg-white/70 text-sm px-3 py-1"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  New Arrivals
                </Button>
                <Button
                  variant={activeTab === "Exclusive" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("Exclusive")}
                  className="rounded-md text-purple-700 hover:text-purple-900 hover:bg-white/70 text-sm px-3 py-1"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Exclusive
                </Button>
              </div>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-amber-500 text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-light text-stone-700 mb-3">Collection Coming Soon</h3>
              <p className="text-stone-500 font-light text-lg">Our luxury collection is being curated with care</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => {
                const displayProduct = transformProductForDisplay(product);
                return (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer bg-gradient-to-br from-black via-purple-900 to-black rounded-2xl overflow-hidden hover:bg-gradient-to-br hover:from-black hover:via-purple-800 hover:to-black hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product Image - REDUCED */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-stone-50 to-neutral-50">
                      <img
                        src={displayProduct.image}
                        alt={displayProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Quick Actions - REDUCED */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
                        <button 
                          className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 border border-purple-200"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Heart className="h-3 w-3 text-purple-600" />
                        </button>
                        <button 
                          className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 border border-purple-200"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Eye className="h-3 w-3 text-purple-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Product Info - REDUCED */}
                    <div className="p-3">
                      {/* Brand & Category - REDUCED */}
                      <div className="mb-1">
                        <p className="text-xs font-medium text-purple-200 uppercase tracking-wide mb-1">
                          {displayProduct.brand}
                        </p>
                        <p className="text-xs text-purple-300 font-light">
                          {displayProduct.category}
                        </p>
                      </div>
                      
                      {/* Product Name - REDUCED */}
                      <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-amber-200 transition-colors duration-200">
                        {displayProduct.name}
                      </h3>
                      
                      {/* Rating & Reviews - REDUCED */}
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-2 w-2 ${i < Math.floor(displayProduct.rating) ? 'text-amber-400 fill-current' : 'text-purple-400'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-purple-200 font-medium">
                          ({displayProduct.reviews})
                        </span>
                      </div>
                      
                      {/* Price Section - REDUCED */}
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          {displayProduct.price}
                        </span>
                        <button 
                          className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ShoppingCart className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Brands Section - REDUCED */}
      <section className="py-20 bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-thin text-stone-800 mb-3">Featured Brands</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Discover the world's most prestigious luxury fashion houses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Brand Cards - REDUCED */}
            {[
              { name: "Gucci", description: "Italian Luxury Fashion", initial: "G" },
              { name: "Louis Vuitton", description: "French Luxury House", initial: "L" },
              { name: "Hermès", description: "Artisanal Excellence", initial: "H" },
              { name: "Chanel", description: "Timeless Elegance", initial: "C" },
              { name: "Prada", description: "Innovative Luxury", initial: "P" },
              { name: "Balenciaga", description: "Avant-Garde Style", initial: "B" },
              { name: "Saint Laurent", description: "Parisian Chic", initial: "S" },
              { name: "Valentino", description: "Romantic Luxury", initial: "V" }
            ].map((brand, index) => (
              <div key={index} className="group cursor-pointer bg-gradient-to-br from-black via-purple-900 to-black backdrop-blur-sm rounded-2xl p-6 hover:bg-gradient-to-br hover:from-black hover:via-purple-800 hover:to-black hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 border-2 border-amber-200 group-hover:border-amber-400">
                  <span className="text-2xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors duration-300">{brand.initial}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 text-center group-hover:text-amber-200 transition-colors duration-300">{brand.name}</h3>
                <p className="text-purple-200 text-xs text-center mb-3 group-hover:text-purple-100 transition-colors duration-300">{brand.description}</p>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-amber-400 text-xs text-center font-medium group-hover:text-amber-300 transition-colors duration-300">Premium Partner</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Newsletter Section - REDUCED */}
      <section className="py-20 bg-gradient-to-r from-stone-800 via-neutral-800 to-zinc-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-thin mb-6">Join the Elite</h2>
            <p className="text-xl opacity-90 mb-10 font-light leading-relaxed">
              Be the first to discover our latest luxury collections, exclusive offers, and VIP events. 
              Elevate your style with insider access.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-none text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-light text-base placeholder-stone-500"
              />
              <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-none border-0 text-base">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
} 
