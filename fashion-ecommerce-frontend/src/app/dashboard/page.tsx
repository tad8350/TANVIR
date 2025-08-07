"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, ArrowRight, TrendingUp, Sparkles, Zap } from "lucide-react";
import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardFooter from "@/components/layout/dashboard-footer";
import ProductCard from "@/components/ui/product-card";
import { 
  fetchFeaturedProducts, 
  fetchCategories, 
  fetchBrands,
  fetchColors,
  fetchSizes,
  getProductPrice,
  getProductRating,
  getProductImage,
  getProductVariantsWithDetails,
  type Product,
  type Category,
  type Brand,
  type Color,
  type Size
} from "@/lib/api";
import dynamic from "next/dynamic";
import Image from 'next/image';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [productsData, categoriesData, brandsData, colorsData, sizesData] = await Promise.all([
          fetchFeaturedProducts(20),
          fetchCategories(),
          fetchBrands({ limit: 10 }),
          fetchColors(),
          fetchSizes()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData.data);
        setColors(colorsData);
        setSizes(sizesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform products for display with enhanced data
  const transformProductForDisplay = (product: Product) => {
    try {
      const priceInfo = getProductPrice(product);
      const ratingInfo = getProductRating(product);
      const imageUrl = getProductImage(product);
      
      // Determine tag based on product data
      let tag = null;
      let tagColor = null;
      
      if (priceInfo.discountPrice && priceInfo.discountPrice > 0) {
        tag = "SALE";
        tagColor = "bg-gradient-to-r from-orange-500 to-red-500";
      } else if (product.created_at) {
        const daysSinceCreated = Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated <= 7) {
          tag = "NEW";
          tagColor = "bg-gradient-to-r from-green-500 to-emerald-500";
        }
      }

      // Ensure price is a valid number
      const price = typeof priceInfo.price === 'number' && !isNaN(priceInfo.price) ? priceInfo.price : 0;
      const discountPrice = typeof priceInfo.discountPrice === 'number' && !isNaN(priceInfo.discountPrice) ? priceInfo.discountPrice : null;

      // Get available colors and sizes from variants
      const availableColors = product.variants
        ?.filter(v => v.is_active && v.color_id)
        .map(v => colors.find(c => c.id === v.color_id))
        .filter(Boolean) || [];

      const availableSizes = product.variants
        ?.filter(v => v.is_active && v.size_id)
        .map(v => sizes.find(s => s.id === v.size_id))
        .filter(Boolean) || [];

      return {
        id: product.id,
        name: product.name || "Unnamed Product",
        price: discountPrice && discountPrice > 0 ? `$${discountPrice.toFixed(2)}` : `$${price.toFixed(2)}`,
        originalPrice: discountPrice && discountPrice > 0 ? `$${price.toFixed(2)}` : null,
        image: imageUrl || "/api/placeholder/300/400",
        tag,
        tagColor,
        rating: ratingInfo.rating,
        reviews: ratingInfo.reviewCount,
        brand: product.brand?.brand_name || "Unknown Brand",
        category: product.category?.name || "Uncategorized",
        availableColors: availableColors.slice(0, 3), // Show first 3 colors
        availableSizes: availableSizes.slice(0, 3), // Show first 3 sizes
        variantCount: product.variants?.filter(v => v.is_active).length || 0
      };
    } catch (error) {
      console.error('Error transforming product:', product.id, error);
      // Return a fallback product display
      return {
        id: product.id,
        name: product.name || "Unnamed Product",
        price: "$0.00",
        originalPrice: null,
        image: "/api/placeholder/300/400",
        tag: null,
        tagColor: null,
        rating: 0,
        reviews: 0,
        brand: product.brand?.brand_name || "Unknown Brand",
        category: product.category?.name || "Uncategorized",
        availableColors: [],
        availableSizes: [],
        variantCount: 0
      };
    }
  };

  // Get featured products (first 5 with variants and images)
  const productsWithVariants = products.filter(product => 
    product.variants && product.variants.length > 0
  );
  
  // Enhanced mock products with better styling
  const mockProducts = [
    {
      id: 9991,
      name: "Premium Cotton T-Shirt",
      price: "$25.00",
      originalPrice: "$30.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-gradient-to-r from-orange-500 to-red-500",
      rating: 4.5,
      reviews: 128,
      brand: "Fashion Forward",
      category: "T-Shirts",
      availableColors: [],
      availableSizes: [],
      variantCount: 0
    },
    {
      id: 9992,
      name: "Slim Fit Denim Jeans",
      price: "$80.00",
      originalPrice: null,
      image: "/api/placeholder/300/400",
      tag: "NEW",
      tagColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      rating: 4.8,
      reviews: 89,
      brand: "Fashion Forward",
      category: "Jeans",
      availableColors: [],
      availableSizes: [],
      variantCount: 0
    },
    {
      id: 9993,
      name: "Casual Canvas Sneakers",
      price: "$120.00",
      originalPrice: "$150.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-gradient-to-r from-orange-500 to-red-500",
      rating: 4.2,
      reviews: 156,
      brand: "Fashion Forward",
      category: "Shoes",
      availableColors: [],
      availableSizes: [],
      variantCount: 0
    },
    {
      id: 9994,
      name: "Classic Denim Jacket",
      price: "$95.00",
      originalPrice: null,
      image: "/api/placeholder/300/400",
      tag: null,
      tagColor: null,
      rating: 4.6,
      reviews: 203,
      brand: "Fashion Forward",
      category: "Jackets",
      availableColors: [],
      availableSizes: [],
      variantCount: 0
    },
    {
      id: 9995,
      name: "Floral Summer Dress",
      price: "$65.00",
      originalPrice: "$85.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-gradient-to-r from-orange-500 to-red-500",
      rating: 4.7,
      reviews: 67,
      brand: "Fashion Forward",
      category: "Dresses",
      availableColors: [],
      availableSizes: [],
      variantCount: 0
    }
  ];

  const featuredProducts = productsWithVariants.length >= 5 
    ? productsWithVariants.slice(0, 5).map(transformProductForDisplay)
    : mockProducts.slice(0, 5);
  
  // Get trending products (next 5 with variants and images)
  const trendingProducts = productsWithVariants.length >= 10
    ? productsWithVariants.slice(5, 10).map(transformProductForDisplay)
    : mockProducts.slice(0, 5);
  
  // Get lifestyle products (remaining with variants and images)
  const lifestyleProducts = productsWithVariants.length >= 15
    ? productsWithVariants.slice(10, 15).map(transformProductForDisplay)
    : mockProducts.slice(0, 5);

  // Enhanced categories with better styling
  const categoryDisplay = categories.slice(0, 4).map((category, index) => ({
    name: category.name,
    count: `${Math.floor(Math.random() * 2) + 1}.${Math.floor(Math.random() * 9)}K+ Products`,
    color: ["bg-gradient-to-br from-blue-50 to-blue-100", "bg-gradient-to-br from-pink-50 to-pink-100", "bg-gradient-to-br from-green-50 to-green-100", "bg-gradient-to-br from-purple-50 to-purple-100"][index % 4],
    icon: ["👕", "👖", "👟", "👗"][index % 4]
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#2563eb] mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2563eb] animate-ping opacity-20"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading amazing products...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your fashion experience</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-red-500 text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </Button>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <DashboardHeader />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-[#dbeafe] via-[#f8fafc] to-[#dbeafe] py-16 lg:py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2563eb] opacity-10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-[#64748b] opacity-10 rounded-full"></div>
        </div>
        
        <div className="relative max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-[#2563eb]" />
                  <p className="text-[#2563eb] text-sm font-semibold tracking-wide uppercase">TAD Trends, Fashion</p>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Access,{" "}
                  <span className="bg-gradient-to-r from-[#2563eb] to-[#64748b] bg-clip-text text-transparent">
                    Diversity
                  </span>
              </h1>
              </div>
              <p className="text-gray-600 text-xl leading-relaxed max-w-lg">
                Discover the latest fashion trends and styles from top brands. Shop with confidence and express your unique style with our curated collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-[#2563eb] to-[#64748b] hover:from-[#1d4ed8] hover:to-[#475569] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-96 lg:h-[500px] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb] opacity-10"></div>
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#2563eb] to-[#64748b] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold">TAD</span>
                  </div>
                  <span className="text-gray-600 font-medium text-lg">Hero Image Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-[#2563eb]" />
              <h2 className="text-4xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">Discover our curated collections for every style and occasion. Find your perfect look with our carefully selected categories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categoryDisplay.map((category, index) => (
              <div key={index} className={`${category.color} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100`}>
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 font-medium">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products Section */}
      <section className="pt-20 pb-10 bg-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-[#2563eb]" />
                <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
              </div>
              <p className="text-gray-600 text-lg">The most popular styles this season</p>
            </div>
            <div className="flex space-x-8 text-sm font-medium">
              {["Featured", "For Carsis", "Color Brands", "Stamdfed"].map((tab) => (
                <span 
                  key={tab}
                  className={`cursor-pointer transition-all duration-200 ${
                    activeTab === tab 
                                        ? "text-[#2563eb] underline decoration-2 underline-offset-4 font-semibold" 
                  : "text-gray-600 hover:text-[#2563eb]"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:scale-105">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#64748b] rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Product Image</span>
                      </div>
                    </div>
                    {product.tag && (
                      <div className={`absolute top-3 left-3 ${product.tagColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {product.tag}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex space-x-2">
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110">
                          <Heart className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110">
                          <ShoppingCart className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-base">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</p>
                    
                    {/* Show available colors and sizes */}
                    {product.availableColors.length > 0 && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-500 font-medium">Colors:</span>
                        {product.availableColors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: color?.hex_code || '#ccc' }}
                            title={color?.name}
                          />
                        ))}
                        {product.availableColors.length > 3 && (
                          <span className="text-xs text-gray-400">+{product.availableColors.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {product.availableSizes.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-medium">Sizes:</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {product.availableSizes.map(s => s?.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Brands Section */}
      <section className="pt-10 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-6 w-6 text-[#2563eb]" />
                <h2 className="text-4xl font-bold text-gray-900">Featured Brands</h2>
              </div>
              <p className="text-gray-600 text-lg">Discover the latest trends from top fashion brands</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="border-2 border-gray-300 hover:bg-gray-50 hover:border-[#2563eb] transition-all duration-200">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="border-2 border-gray-300 hover:bg-gray-50 hover:border-[#2563eb] transition-all duration-200">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:scale-105">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#64748b] rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Product Image</span>
                      </div>
                    </div>
                    {product.tag && (
                      <div className={`absolute top-3 left-3 ${product.tagColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {product.tag}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex space-x-2">
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110">
                          <Heart className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110">
                          <ShoppingCart className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-base">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</p>
                    
                    {/* Show available colors and sizes */}
                    {product.availableColors.length > 0 && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-500 font-medium">Colors:</span>
                        {product.availableColors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: color?.hex_code || '#ccc' }}
                            title={color?.name}
                          />
                        ))}
                        {product.availableColors.length > 3 && (
                          <span className="text-xs text-gray-400">+{product.availableColors.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {product.availableSizes.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-medium">Sizes:</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {product.availableSizes.map(s => s?.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Lifestyle Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
                <div className="mb-6 sm:mb-0">
                                  <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="h-6 w-6 text-[#2563eb]" />
                  <h2 className="text-4xl font-bold text-gray-900">Lifestyle Collection</h2>
                </div>
                  <p className="text-gray-600 text-lg">Curated styles for every occasion</p>
                </div>
                <div className="flex space-x-6 text-sm font-medium">
                  <span className="text-gray-600 cursor-pointer hover:text-[#2563eb] transition-colors duration-200">LOVSIN</span>
                  <span className="text-[#2563eb] underline decoration-2 underline-offset-4 cursor-pointer font-semibold">SCENTON</span>
                  <span className="text-gray-600 cursor-pointer hover:text-[#2563eb] transition-colors duration-200">LISTTERS CHLIP</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {lifestyleProducts.map((product) => (
                  <div key={product.id} className="group">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#64748b] rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Lifestyle Image</span>
                      </div>
                      {product.tag && (
                        <div className={`absolute top-3 left-3 ${product.tagColor} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
                          {product.tag}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{product.name}</h3>
                      <p className="text-gray-600 text-sm font-bold">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#dbeafe] to-[#f1f5f9] rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="h-6 w-6 text-[#2563eb]" />
                  <h3 className="text-2xl font-bold text-gray-900">Featured brands</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Discover amazing products from top brands. Quality guaranteed with every purchase.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">30-day return policy</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                  Shop with confidence knowing you're getting the best quality products from trusted brands.
                </p>
                
                <Button className="bg-gradient-to-r from-[#2563eb] to-[#64748b] hover:from-[#1d4ed8] hover:to-[#475569] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 w-full shadow-lg">
                  SHOP NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-[#2563eb] to-[#64748b] text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
        </div>
        
        <div className="relative max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sparkles className="h-8 w-8 text-white" />
            <h2 className="text-4xl font-bold">Stay Updated</h2>
          </div>
          <p className="text-gray-100 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Get the latest fashion trends, exclusive offers, and style tips delivered to your inbox.
            Join our community of fashion enthusiasts and never miss out on the hottest styles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 text-lg font-medium"
            />
            <Button className="bg-white text-[#2563eb] hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Subscribe
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-200 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
} 