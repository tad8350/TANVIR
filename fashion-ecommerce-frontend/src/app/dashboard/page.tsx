"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, ArrowRight, TrendingUp, Sparkles, Zap } from "lucide-react";
import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardFooter from "@/components/layout/dashboard-footer";
import ProductCard from "@/components/ui/product-card";
import { apiService } from "@/lib/api";
import dynamic from "next/dynamic";
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
  const [activeTab, setActiveTab] = useState("Featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsData = await apiService.getProducts(1, 20);
        console.log('Products data:', productsData); // Debug log
        
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

  // Transform products for display
  const transformProductForDisplay = (product: Product) => {
    try {
      // Extract brand name safely
      let brandName = 'Unknown Brand';
      if (typeof product.brand === 'string') {
        brandName = product.brand;
      } else if (product.brand && typeof product.brand === 'object') {
        brandName = (product.brand as any).brand_name || (product.brand as any).name || 'Unknown Brand';
      }

      // Get the lowest price from variants if available
      let price = 0;
      let discountPrice = 0;
      if (product.variants && product.variants.length > 0) {
        const prices = product.variants.map(v => parseFloat(v.price || '0'));
        const discountPrices = product.variants.map(v => parseFloat(v.discount_price || '0'));
        price = Math.min(...prices);
        discountPrice = Math.min(...discountPrices.filter(p => p > 0));
      }

      // Get category from categoryLevel fields
      let category = 'Uncategorized';
      if (product.categoryLevel1) {
        category = product.categoryLevel1;
        if (product.categoryLevel2) {
          category += ` > ${product.categoryLevel2}`;
        }
        if (product.categoryLevel3) {
          category += ` > ${product.categoryLevel3}`;
        }
        if (product.categoryLevel4) {
          category += ` > ${product.categoryLevel4}`;
        }
      }

      // Get first image or use placeholder
      let imageUrl = '/images/placeholder-product.jpg';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].url;
      }

      // Debug logging
      console.log('Product transformation for ID:', product.id, {
        name: product.name || product.title,
        brandName,
        price,
        discountPrice,
        category,
        imageUrl,
        variantsCount: product.variants?.length || 0
      });

      // Determine tag based on product data
      let tag: string | undefined = undefined;
      let tagColor: string | undefined = undefined;
      
      if (discountPrice > 0) {
        tag = "SALE";
        tagColor = "bg-gradient-to-r from-orange-500 to-red-500";
      } else if (product.created_at) {
        const daysSinceCreated = Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated <= 7) {
          tag = "NEW";
          tagColor = "bg-gradient-to-r from-green-500 to-emerald-500";
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
        rating: 0, // Default rating since not in current data
        reviews: 0, // Default review count since not in current data
        brand: brandName,
        category: category
      };
    } catch (error) {
      console.error('Error transforming product:', product.id, error);
      // Return a fallback product display
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
      return products.slice(0, 8); // Show first 8 products
    }
    return products;
  }, [products, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">TAD</span>
              </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the latest fashion trends and premium products
              </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Trends
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab} Products
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "Featured" ? "default" : "outline"}
                onClick={() => setActiveTab("Featured")}
              >
                Featured
              </Button>
              <Button
                variant={activeTab === "New" ? "default" : "outline"}
                onClick={() => setActiveTab("New")}
              >
                New Arrivals
              </Button>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Products will appear here once they are added to the system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const displayProduct = transformProductForDisplay(product);
                return (
                  <ProductCard
                    key={product.id}
                    id={displayProduct.id}
                    name={displayProduct.name}
                    price={displayProduct.price}
                    originalPrice={displayProduct.originalPrice}
                    image={displayProduct.image}
                    tag={displayProduct.tag}
                    tagColor={displayProduct.tagColor}
                    rating={displayProduct.rating}
                    reviews={displayProduct.reviews}
                    brand={displayProduct.brand}
                    category={displayProduct.category}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
} 
