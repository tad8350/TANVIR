"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  X,
  Search,
  User,
  Menu
} from "lucide-react";
import { apiService } from "@/lib/api";
import Image from 'next/image';

// Cart and Wishlist Context
interface CartItem {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  name: string;
  color: string;
  size: string;
  image: string;
}

interface WishlistItem {
  productId: number;
  name: string;
  image: string;
  price: number;
}

// Simple cart and wishlist state - no complex callbacks
let cartItems: CartItem[] = [];
let wishlistItems: WishlistItem[] = [];

// Load from localStorage
if (typeof window !== 'undefined') {
  try {
    cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch (error) {
    console.error('Error loading cart/wishlist from localStorage:', error);
  }
}

const addToCart = (item: CartItem) => {
  const existingItemIndex = cartItems.findIndex(
    cartItem => cartItem.productId === item.productId && cartItem.variantId === item.variantId
  );
  
  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += item.quantity;
  } else {
    cartItems.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(cartItems));
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

const addToWishlist = (item: WishlistItem) => {
  const existingItem = wishlistItems.find(
    wishlistItem => wishlistItem.productId === item.productId
  );
  
  if (!existingItem) {
    wishlistItems.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }
  
  return wishlistItems.length;
};

interface ProductVariant {
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
}

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
  variants?: ProductVariant[];
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    
    // Set initial counts
    const initialCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const initialWishlistCount = wishlistItems.length;
    console.log('Initial counts - Cart:', initialCartCount, 'Wishlist:', initialWishlistCount);
    setCartCount(initialCartCount);
    setWishlistCount(initialWishlistCount);
    
    return () => {
      // No subscriptions to unsubscribe from
    };
  }, [productId]);

    const fetchProduct = async () => {
      try {
        setLoading(true);
      const productData = await apiService.getProduct(Number(productId));
      
      if (productData && productData.data) {
        setProduct(productData.data as Product);
        // Set default color and size selections based on first available variant
        if ((productData.data as any).variants && (productData.data as any).variants.length > 0) {
          const firstVariant = (productData.data as any).variants[0];
          console.log('Setting default variant - Color:', firstVariant.color.name, 'Size:', firstVariant.size.name);
          setSelectedColor(firstVariant.color_id);
          setSelectedSize(firstVariant.size_id);
        }
      } else if (productData && (productData as any).id) {
        setProduct(productData as unknown as Product);
        if ((productData as any).variants && (productData as any).variants.length > 0) {
          const firstVariant = (productData as any).variants[0];
          console.log('Setting default variant (alt case) - Color:', firstVariant.color.name, 'Size:', firstVariant.size.name);
          setSelectedColor(firstVariant.color_id);
          setSelectedSize(firstVariant.size_id);
        }
      } else {
        setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleColorSelect = (colorId: number) => {
    setSelectedColor(colorId);
    setSelectedSize(null); // Reset size when color changes
    setSelectedImageIndex(0); // Reset to first image of new color
    
    // Auto-select the first available size for the new color
    const availableSizesForColor = product?.variants
      ?.filter(v => v.color_id === colorId)
      .map(v => v.size) || [];
    
    if (availableSizesForColor.length > 0) {
      setSelectedSize(availableSizesForColor[0].id);
    }
  };

  const handleSizeSelect = (sizeId: number) => {
    setSelectedSize(sizeId);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const getSelectedVariant = () => {
    if (!product?.variants) return null;
    return product.variants.find(
      v => v.color_id === selectedColor && v.size_id === selectedSize
    );
  };

  const getCurrentPrice = () => {
    const variant = getSelectedVariant();
    if (variant) {
      // Use discount_price if available and greater than 0, otherwise use regular price
      const price = variant.discount_price && parseFloat(variant.discount_price) > 0 
        ? parseFloat(variant.discount_price) 
        : parseFloat(variant.price);
      console.log('Current price from variant:', price, 'variant:', variant);
      console.log('Selected color:', selectedColor, 'Selected size:', selectedSize);
      return price;
    }
    console.log('No variant found for price - selectedColor:', selectedColor, 'selectedSize:', selectedSize);
    return 0;
  };

  const getOriginalPrice = () => {
    const variant = getSelectedVariant();
    if (variant) {
      // If there's a discount, show the original price
      if (variant.discount_price && parseFloat(variant.discount_price) > 0 && parseFloat(variant.discount_price) < parseFloat(variant.price)) {
        return parseFloat(variant.price);
      }
      // If no discount, return 0 to avoid showing "0% OFF"
      return 0;
    }
    return 0;
  };

  const isOutOfStock = () => {
    const variant = getSelectedVariant();
    return variant ? variant.stock === 0 : true;
  };

  const isLowStock = () => {
    const variant = getSelectedVariant();
    return variant ? variant.stock <= variant.lowStockThreshold : false;
  };

  // Get available colors for this product
  const getAvailableColors = () => {
    if (!product?.variants) return [];
    const colors = new Map();
    product.variants.forEach(variant => {
      if (!colors.has(variant.color_id)) {
        colors.set(variant.color_id, variant.color);
      }
    });
    return Array.from(colors.values());
  };

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    if (!product?.variants || !selectedColor) return [];
    return product.variants
      .filter(v => v.color_id === selectedColor)
      .map(v => v.size);
  };

  // Get images for selected color (filter by color)
  const getImagesForColor = () => {
    if (!product?.images) return [];
    
    // Debug: Log what's happening
    console.log('Available colors:', availableColors);
    console.log('Selected color:', selectedColor);
    console.log('Total images:', product.images.length);
    
    // If no color selected, default to first available color
    if (!selectedColor && availableColors.length > 0) {
      const firstColor = availableColors[0];
      setSelectedColor(firstColor.id);
      console.log('Setting default color to:', firstColor.name);
      // Return first 3 images (assuming they're for first color)
      return product.images.slice(0, 3);
    }
    
    // FIXED: Properly map colors to their corresponding images
    // Based on your data structure, we need to map colors to image ranges
    const colorIndex = availableColors.findIndex(color => color.id === selectedColor);
    console.log('Color index:', colorIndex);
    
    if (colorIndex === 0) {
      // First color (Black) - show first 3 images
      console.log('Showing first 3 images for Black color');
      return product.images.slice(0, 3);
    } else if (colorIndex === 1) {
      // Second color (White) - show next 3 images  
      console.log('Showing next 3 images for White color');
      return product.images.slice(3, 6);
    }
    
    // Default fallback - show first 3 images
    console.log('Using fallback images');
    return product.images.slice(0, 3);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize || !product) {
      console.log('Cannot add to cart - missing:', { selectedColor, selectedSize, product: !!product });
      return;
    }
    
    const variant = getSelectedVariant();
    if (!variant) {
      console.log('No variant found for selected color/size');
      return;
    }
    
    console.log('Adding to cart:', { product: product.name, variant, quantity });
    setIsAddingToCart(true);
    try {
      // Add to cart and get new count
      const newCartCount = addToCart({
        productId: product.id,
        variantId: variant.id,
        quantity: quantity,
        price: parseFloat(variant.price),
        name: product.name,
        color: variant.color.name,
        size: variant.size.name,
        image: colorImages[0]?.url || ''
      });
      
      // Update the cart count in component state immediately
      setCartCount(newCartCount);
      
      // Dispatch custom event to update header counts
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Show success feedback
      console.log(`Added ${quantity}x ${product.name} (${variant.color.name}, ${variant.size.name}) to cart`);
      console.log('New cart count:', newCartCount);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) {
      console.log('Cannot add to wishlist - no product');
      return;
    }
    
    console.log('Adding to wishlist:', { product: product.name });
    setIsAddingToWishlist(true);
    try {
      // Add to wishlist and get new count
      const newWishlistCount = addToWishlist({
        productId: product.id,
        name: product.name,
        image: colorImages[0]?.url || '',
        price: getCurrentPrice()
      });
      
      // Update the wishlist count in component state immediately
      setWishlistCount(newWishlistCount);
      
      // Dispatch custom event to update header counts
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      
      // Show success feedback
      console.log(`Added ${product.name} to wishlist`);
      console.log('New wishlist count:', newWishlistCount);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenImageIndex(index);
    setIsFullscreenOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const nextFullscreenImage = () => {
    if (colorImages.length > 1) {
      setFullscreenImageIndex((prev) => 
        prev < colorImages.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevFullscreenImage = () => {
    if (colorImages.length > 1) {
      setFullscreenImageIndex((prev) => 
        prev > 0 ? prev - 1 : colorImages.length - 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case 'ArrowRight':
          nextFullscreenImage();
          break;
        case 'ArrowLeft':
          prevFullscreenImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto"></div>
            <p className="mt-6 text-amber-400 font-light text-lg">Loading luxury product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-amber-400 text-6xl mb-6">💎</div>
            <p className="text-amber-400 text-xl mb-4">{error || 'Product not found'}</p>
            <Button 
              onClick={() => router.back()} 
              className="mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-semibold px-8 py-3"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const brandName = typeof product.brand === 'string' 
    ? product.brand 
    : product.brand?.brand_name || 'Unknown Brand';

  const category = product.categoryLevel1 || 'Uncategorized';
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();
  const colorImages = getImagesForColor();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
      {/* Luxury Navigation Header - MATCHING DASHBOARD HERO THEME */}
      <header className="bg-gradient-to-r from-black via-purple-900 to-black border-b border-purple-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.back()}
                  className="text-white hover:bg-purple-800/50 hover:text-amber-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="text-2xl font-bold text-white">TAD</div>
              </div>
              
              {/* Navigation Categories */}
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                  Women
                </a>
                <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                  Men
                </a>
                <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                  Kids
                </a>
                <a href="#" className="text-purple-200 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors">
                  Sale
                </a>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search for products, brands & more"
                  className="w-full pl-10 pr-4 py-2 border border-purple-600 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-purple-900/50 text-white placeholder-purple-300"
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-purple-800/50 hover:text-amber-200">
                <User className="h-5 w-5" />
              </Button>
              <a href="/wishlist" className="relative inline-flex items-center justify-center p-2 text-sm font-medium text-purple-200 bg-transparent border border-transparent rounded-md hover:text-amber-200 hover:bg-purple-800/50">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </a>
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-purple-800/50 hover:text-amber-200" onClick={() => router.push('/cart')}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Product Content - LIGHT BACKGROUND LIKE DASHBOARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            {/* Main Image Container with Left Thumbnails */}
            <div className="flex space-x-4">
              {/* Left Side - Vertical Thumbnail Gallery */}
              {colorImages.length > 1 && (
                <div className="flex flex-col space-y-3 w-24">
                  {colorImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageChange(index)}
                      className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        index === selectedImageIndex 
                          ? 'border-amber-400 shadow-lg scale-105 shadow-amber-500/30'
                          : 'border-purple-600 hover:border-purple-500 hover:shadow-purple-500/20' // PURPLE BORDER
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} - Image ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain bg-gradient-to-br from-stone-100 to-neutral-200"
                        style={{ objectPosition: 'center' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Right Side - Main Image */}
              <div className="flex-1">
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-600 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl cursor-pointer" onClick={() => openFullscreen(selectedImageIndex)}>
                  <div className="aspect-[3/4] relative">
                    {colorImages.length > 0 ? (
                      <Image
                        src={colorImages[selectedImageIndex]?.url || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone-50 to-neutral-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-black text-lg font-bold">TAD</span>
                          </div>
                          <span className="text-stone-600">Product Image</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Click to expand hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-stone-700">
                        Click to expand
                      </div>
                    </div>
                    
                    {/* 3D Floating Elements on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                      {/* Floating Sparkles - Neutral colors only */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-white/80 rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white/60 rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute top-12 right-12 w-2.5 h-2.5 bg-white/70 rounded-full animate-pulse shadow-lg"></div>
                      
                      {/* 3D Depth Lines - Subtle neutral */}
                      <div className="absolute bottom-4 left-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 transform -rotate-12"></div>
                      <div className="absolute bottom-8 left-8 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 transform -rotate-12"></div>
                    </div>
                    
                    {/* Navigation arrows */}
                    {colorImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening fullscreen
                            setSelectedImageIndex(prev => prev > 0 ? prev - 1 : colorImages.length - 1);
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-purple-200 group-hover:translate-x-1 group-hover:shadow-xl z-10"
                        >
                          <ChevronLeft className="h-5 w-5 text-purple-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening fullscreen
                            setSelectedImageIndex(prev => prev < colorImages.length - 1 ? prev + 1 : 0);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-purple-200 group-hover:-translate-x-1 group-hover:shadow-xl z-10"
                        >
                          <ChevronRight className="h-5 w-5 text-purple-700" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Information - PURPLE BORDER */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-600 shadow-lg space-y-6"> {/* PURPLE BORDER */}
            {/* Breadcrumb */}
            <nav className="text-xs text-stone-500">
              <span className="hover:text-stone-700 cursor-pointer transition-colors">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-stone-700 cursor-pointer transition-colors">{category}</span>
              <span className="mx-2">/</span>
              <span className="text-stone-800">{product.name}</span>
            </nav>

            {/* Brand */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500">Brand:</span>
              <Badge variant="outline" className="text-xs font-medium border-amber-400 text-amber-600">
                {brandName}
              </Badge>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-stone-800 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4 ? 'text-amber-400 fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-stone-600">4.0 (128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-stone-800">
                  ${getCurrentPrice().toFixed(2)}
                </span>
                {getOriginalPrice() > 0 && getOriginalPrice() > getCurrentPrice() && (
                  <span className="text-xl text-stone-500 line-through">
                    ${getOriginalPrice().toFixed(2)}
                  </span>
                )}
                {getOriginalPrice() > 0 && getOriginalPrice() > getCurrentPrice() && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs px-3 py-1 font-bold">
                    {Math.round(((getOriginalPrice() - getCurrentPrice()) / getOriginalPrice()) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-stone-800">Description</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-stone-800">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                        selectedColor === color.id
                          ? 'border-amber-400 bg-amber-400/20 shadow-md shadow-amber-500/30'
                          : 'border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className={`text-xs font-medium ${
                        selectedColor === color.id ? 'text-amber-700' : 'text-stone-600'
                      }`}>{color.name}</span>
                      {selectedColor === color.id && (
                        <Check className="h-3 w-3 text-amber-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-stone-800">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeSelect(size.id)}
                      className={`px-3 py-2 rounded-md border-2 transition-all duration-200 ${
                        selectedSize === size.id
                          ? 'border-amber-400 bg-amber-400/20 text-amber-700 shadow-md shadow-amber-500/30'
                          : 'border-stone-200 hover:border-amber-400 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span className="text-xs font-medium">{size.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-stone-800">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0 border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-amber-400"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold text-stone-800">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 p-0 border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-amber-400"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {selectedColor && selectedSize && (
              <div className="space-y-2">
                {isOutOfStock() ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <X className="h-4 w-4" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                ) : isLowStock() ? (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm font-medium">Low Stock - Only {getSelectedVariant()?.stock} left!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium">In Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedSize || isOutOfStock() || isAddingToCart}
                size="default"
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold py-3 text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-amber-500/25"
              >
                {isAddingToCart ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Adding to Cart...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </div>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="default"
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className="w-full border-2 border-stone-300 hover:border-amber-400 text-stone-600 hover:text-amber-600 font-semibold py-3 text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:bg-stone-50"
              >
                {isAddingToWishlist ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-500"></div>
                    <span>Adding to Wishlist...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Add to Wishlist</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              <div className="flex items-center space-x-2 text-xs text-stone-600">
                <Truck className="h-4 w-4 text-amber-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-600">
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-600">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections - PURPLE GRADIENT LIKE DASHBOARD FEATURED BRANDS */}
        <div className="mt-16 space-y-12">
          {/* Product Details */}
          <div className="bg-gradient-to-br from-black via-purple-900 to-black backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>Premium Cotton</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Care:</span>
                    <span>Machine Wash Cold</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fit:</span>
                    <span>Regular Fit</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Shipping & Returns</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>2-5 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returns:</span>
                    <span>30 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-gradient-to-br from-black via-purple-900 to-black backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-700 hover:border-purple-500 hover:shadow-purple-500/30 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
            <div className="text-center py-8">
              <div className="text-amber-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">No reviews yet</h3>
              <p className="text-purple-300">Be the first to review this product!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal - TRANSPARENT BACKGROUND */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center"> {/* Changed from bg-black/95 to bg-black/30 */}
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-200 hover:scale-110 border border-white/30"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Main Image */}
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            <Image
              src={colorImages[fullscreenImageIndex]?.url || '/images/placeholder-product.jpg'}
              alt={product.name}
              width={1200}
              height={1600}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-white/90 backdrop-blur-sm" // Added white background for image
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {colorImages.length > 1 && (
            <>
              <button
                onClick={prevFullscreenImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-full transition-all duration-200 hover:scale-110 border border-white/30"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={nextFullscreenImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-full transition-all duration-200 hover:scale-110 border border-white/30"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {colorImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white text-sm font-medium">
                {fullscreenImageIndex + 1} / {colorImages.length}
              </span>
            </div>
          )}

          {/* Thumbnail Strip */}
          {colorImages.length > 1 && (
            <div className="absolute bottom-6 left-6 flex space-x-2">
              {colorImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setFullscreenImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === fullscreenImageIndex 
                      ? 'border-amber-400 shadow-lg scale-110'
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
