"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ArrowLeft,
  Truck,
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  Star,
  ArrowRight
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { apiService } from "@/lib/api";

interface CartItem {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  name: string;
  color: string;
  size: string;
  image: string;
  brand?: string;
  originalPrice?: number;
}

// Full product data interface matching product details page
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
    product: {
      id: number;
      name: string;
      title: string;
      description: string;
      price: string;
      salePrice: string;
      costPrice: string;
      brand: string;
      status: string;
      category_id: number;
      categoryLevel1: string;
      categoryLevel2: string;
      categoryLevel3: string;
      categoryLevel4: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fullProductData, setFullProductData] = useState<{ [key: number]: FullProductData }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryCost] = useState(4.90);

  useEffect(() => {
    // Load cart items from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const items = JSON.parse(stored);
          setCartItems(items);
          
          // Fetch full product data for each cart item
          items.forEach((item: CartItem) => {
            fetchFullProductData(item.productId);
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchFullProductData = async (productId: number) => {
    try {
      // Instead of fetching full product data, fetch product variants which now include brand info
      const response = await apiService.getProductVariants(1, 100, productId);
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the first variant to extract product and brand info
        const variant = response.data[0] as any;
        if (variant.product && variant.product.brand) {
          // Create a simplified product data structure with brand info
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
      // Fallback to old method if variant API fails
      try {
        const response = await apiService.getProduct(productId);
        if (response && response.data && (response.data as any).id) {
          setFullProductData((prev: { [key: number]: FullProductData }) => ({
            ...prev,
            [productId]: response.data as FullProductData
          }));
        }
      } catch (fallbackError) {
        console.error('Fallback product fetch also failed:', fallbackError);
      }
    }
  };

  const updateCartItemQuantity = (variantId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    
    const newCart = cartItems.map((item: CartItem) => 
      item.variantId === variantId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Dispatch custom event to update header counts
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeFromCart = (variantId: number) => {
    const newCart = cartItems.filter((item: CartItem) => item.variantId !== variantId);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Remove from full product data
    setFullProductData((prev: { [key: number]: FullProductData }) => {
      const newData = { ...prev };
      // Find the product ID for this variant and remove it
      const itemToRemove = cartItems.find((item: CartItem) => item.variantId === variantId);
      if (itemToRemove) {
        delete newData[itemToRemove.productId];
      }
      return newData;
    });
    
    // Dispatch custom event to update header counts
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const addToWishlist = (item: CartItem) => {
    // Add to wishlist logic here
    console.log('Adding to wishlist:', item);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + deliveryCost;
  };

  const getDiscount = (item: CartItem) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    }
    return 0;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-6 text-amber-400 font-light text-lg">Loading your luxury cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-neutral-50 to-zinc-50">
      <Header />
      
      {/* Luxury Header Section - WHITE BACKGROUND WITH PURPLE TEXT */}
      <header className="bg-white border-b border-purple-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-4xl font-thin text-purple-800 mb-2">Your Cart</h1>
              <p className="text-lg text-purple-600 max-w-2xl mx-auto font-light">
                Review and complete your luxury purchase
              </p>
            </div>
            
            {/* Empty div for balance */}
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-amber-400" />
            <h1 className="text-3xl font-thin text-stone-800 mb-4">Your cart is empty</h1>
            <p className="text-stone-600 mb-8 font-light text-lg">Start shopping to add luxury items to your cart</p>
            <Button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2" style={{ marginTop: '-2rem' }}>
              <h1 className="text-2xl font-bold text-stone-800 mb-4">
                Your bag ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
              </h1>

              {/* Free Shipping Notice */}
              <div className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    i
                  </div>
                  <div>
                    <p className="text-sm text-stone-700">
                      Almost there! If your bag is over $29.90 you will qualify for free shipping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="flex items-center space-x-2 mb-4 text-sm text-stone-600">
                <Truck className="h-4 w-4 text-amber-500" />
                <span>Parcel shipped by TAD Wed, 20/08</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.variantId} 
                    className="group bg-white/95 backdrop-blur-sm border-2 border-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:shadow-2xl hover:border-purple-500 hover:scale-[1.02]"
                    onClick={() => router.push(`/product/${item.productId}`)}
                  >
                    <div className="flex space-x-6">
                      {/* Product Image */}
                      <div className="w-28 h-28 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="mb-2">
                              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                                {getBrandName(item.productId)}
                              </p>
                            </div>
                            <h3 className="text-lg font-semibold text-stone-800 mb-3 hover:text-purple-600 transition-colors duration-200 flex items-center">
                              {item.name}
                              <ArrowRight className="h-4 w-4 ml-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </h3>
                            <p className="text-xs text-purple-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Click to view product details
                            </p>
                            <div className="text-sm text-stone-600 space-y-1">
                              <p>Colour: {item.color}</p>
                              <p>Size: {item.size}</p>
                            </div>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-2 mt-3">
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
                          </div>
                          
                          {/* Price */}
                          <div className="text-right ml-6">
                            <p className="text-xl font-bold text-stone-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="text-sm text-stone-500">
                                <span className="line-through">${(item.originalPrice * item.quantity).toFixed(2)}</span>
                                <span className="ml-2 text-green-600">-{getDiscount(item)}%</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-amber-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCartItemQuantity(item.variantId, item.quantity - 1);
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm font-medium text-stone-800">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-amber-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCartItemQuantity(item.variantId, item.quantity + 1);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.variantId);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToWishlist(item);
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Notes */}
              <div className="mt-8 space-y-2 text-sm text-stone-600 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200">
                <p>Items placed in this bag are not reserved.</p>
                <p>Pricing: Originally refers to the price the item was first listed at.</p>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-600 sticky top-24 shadow-lg" style={{ marginTop: '7rem' }}>
                <h2 className="text-xl font-semibold text-stone-800 mb-6">Order Summary</h2>
                
                {/* Summary Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Delivery</span>
                    <span>${deliveryCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-4">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>Total VAT included</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white">
                    P Points
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold py-4 text-lg">
                    Go to checkout
                  </Button>
                </div>

                {/* Payment Methods */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-stone-800 mb-3">We accept</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['Visa', 'Mastercard', 'PayPal', 'Klarna'].map((method) => (
                      <div key={method} className="bg-white p-2 rounded border border-stone-200 text-xs text-center text-stone-600">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vouchers */}
                <div className="mt-8">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-stone-800 hover:text-purple-600">
                      Vouchers and gift cards (optional)
                    </summary>
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        placeholder="Enter voucher code"
                        className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs border-purple-600 text-purple-600 hover:bg-purple-50"
                        onClick={() => console.log('Apply voucher clicked')}
                      >
                        Apply voucher
                      </Button>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Recommendations */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-thin text-stone-800">
                We think you'll like these
              </h2>
              <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                See more →
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder recommendation cards */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/95 backdrop-blur-sm border border-stone-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-stone-200 hover:border-purple-400">
                  <div className="relative mb-4">
                    <div className="w-full h-40 bg-gradient-to-br from-stone-100 to-neutral-200 rounded-xl flex items-center justify-center">
                      <span className="text-stone-500 text-sm">Product {i}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/95 hover:bg-white border border-stone-200"
                    >
                      <Heart className="h-4 w-4 text-stone-600" />
                    </Button>
                  </div>
                  <h3 className="text-sm font-medium text-stone-800 mb-2">Brand Name</h3>
                  <p className="text-xs text-stone-500 mb-3">Product description</p>
                  <p className="text-sm font-semibold text-stone-800">$99.99</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
