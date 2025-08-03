"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";
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
        tagColor = "bg-orange-500";
      } else if (product.created_at) {
        const daysSinceCreated = Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated <= 7) {
          tag = "NEW";
          tagColor = "bg-green-500";
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
  
  // If we don't have enough products with variants, create some mock products
  const mockProducts = [
    {
      id: 9991,
      name: "Classic T-Shirt",
      price: "$25.00",
      originalPrice: "$30.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-orange-500",
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
      name: "Slim Fit Jeans",
      price: "$80.00",
      originalPrice: null,
      image: "/api/placeholder/300/400",
      tag: "NEW",
      tagColor: "bg-green-500",
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
      name: "Casual Sneakers",
      price: "$120.00",
      originalPrice: "$150.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-orange-500",
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
      name: "Denim Jacket",
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
      name: "Summer Dress",
      price: "$65.00",
      originalPrice: "$85.00",
      image: "/api/placeholder/300/400",
      tag: "SALE",
      tagColor: "bg-orange-500",
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

  // Transform categories for display
  const categoryDisplay = categories.slice(0, 4).map((category, index) => ({
    name: category.name,
    count: `${Math.floor(Math.random() * 2) + 1}.${Math.floor(Math.random() * 9)}K+ Products`,
    color: ["bg-blue-100", "bg-pink-100", "bg-green-100", "bg-purple-100"][index % 4]
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#8B0000] hover:bg-[#6B0000] text-white">
              Try Again
            </Button>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F5F5DC] to-[#F0F0E0] py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-600 text-sm font-medium">TAD Trends, Fashion</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Access, Diversity
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                Discover the latest fashion trends and styles from top brands. Shop with confidence and express your unique style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#8B0000] hover:bg-[#6B0000] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Shop Now
                </Button>
                <Button variant="outline" className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-80 lg:h-96 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#8B0000] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">TAD</span>
                  </div>
                  <span className="text-gray-600 font-medium">Hero Image Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our curated collections for every style and occasion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryDisplay.map((category, index) => (
              <div key={index} className={`${category.color} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900">Featured Brands</h2>
              <p className="text-gray-600 mt-2">Discover the latest trends from top fashion brands</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#8B0000] rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Product Image</span>
                      </div>
                    </div>
                    {product.tag && (
                      <div className={`absolute top-2 left-2 ${product.tagColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
                        {product.tag}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-1">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <ShoppingCart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                    
                    {/* Show available colors and sizes */}
                    {product.availableColors.length > 0 && (
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-xs text-gray-500">Colors:</span>
                        {product.availableColors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300"
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
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Sizes:</span>
                        <span className="text-xs text-gray-600">
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

      {/* Second Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-600 mt-2">The most popular styles this season</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <span className={`cursor-pointer ${activeTab === "Featured" ? "underline font-medium text-[#8B0000]" : "text-gray-600"}`}
                    onClick={() => setActiveTab("Featured")}>Featured</span>
              <span className={`cursor-pointer ${activeTab === "For Carsis" ? "underline font-medium text-[#8B0000]" : "text-gray-600"}`}
                    onClick={() => setActiveTab("For Carsis")}>For Carsis</span>
              <span className={`cursor-pointer ${activeTab === "Color Brands" ? "underline font-medium text-[#8B0000]" : "text-gray-600"}`}
                    onClick={() => setActiveTab("Color Brands")}>Color Brands</span>
              <span className={`cursor-pointer ${activeTab === "Stamdfed" ? "underline font-medium text-[#8B0000]" : "text-gray-600"}`}
                    onClick={() => setActiveTab("Stamdfed")}>Stamdfed</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#8B0000] rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Product Image</span>
                      </div>
                    </div>
                    {product.tag && (
                      <div className={`absolute top-2 left-2 ${product.tagColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
                        {product.tag}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-1">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <ShoppingCart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                    
                    {/* Show available colors and sizes */}
                    {product.availableColors.length > 0 && (
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-xs text-gray-500">Colors:</span>
                        {product.availableColors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-gray-300"
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
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Sizes:</span>
                        <span className="text-xs text-gray-600">
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

      {/* Third Featured Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-3xl font-bold text-gray-900">Lifestyle Collection</h2>
                  <p className="text-gray-600 mt-2">Curated styles for every occasion</p>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600 cursor-pointer hover:text-[#8B0000]">LOVSIN</span>
                  <span className="underline font-medium text-[#8B0000] cursor-pointer">SCENTON</span>
                  <span className="text-gray-600 cursor-pointer hover:text-[#8B0000]">LISTTERS CHLIP</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {lifestyleProducts.map((product) => (
                  <div key={product.id} className="group">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#8B0000] rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TAD</span>
                        </div>
                        <span className="text-gray-500 text-xs">Lifestyle Image</span>
                      </div>
                      {product.tag && (
                        <div className={`absolute top-2 left-2 ${product.tagColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
                          {product.tag}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm font-bold">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#F5F5DC] to-[#F0F0E0] rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured brands</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover amazing products from top brands. Quality guaranteed with every purchase.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]" />
                    <span className="text-sm text-gray-700">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]" />
                    <span className="text-sm text-gray-700">30-day return policy</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Shop with confidence knowing you're getting the best quality products from trusted brands.
                </p>
                
                <Button className="bg-[#8B0000] hover:bg-[#6B0000] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 w-full">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Get the latest fashion trends, exclusive offers, and style tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-[#8B0000] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
} 