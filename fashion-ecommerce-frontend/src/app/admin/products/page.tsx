"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Users, ShoppingBag, Package, TrendingUp, ArrowRight, 
  Home, Tag, Box, Clipboard, CreditCard, Truck, 
  BarChart3, Settings, Mail, Bell, AlertTriangle, 
  X, CheckCircle, ChevronRight, Settings as SettingsIcon,
  Megaphone, Plus, Cog, MessageSquare, User, LogOut, ChevronDown,
  Clock, Plus as PlusIcon, DollarSign, Tag as TagIcon,
  Search, Edit, Trash2, Eye, MoreHorizontal, Filter,
  Calendar, Building, Globe, Phone, Mail as MailIcon,
  Star, TrendingDown, Users as UsersIcon, ShoppingCart,
  RefreshCw, Image, Hash, Palette, Info
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiService, ProductFormData } from "@/lib/api";
import { toast } from "sonner";
import { adminLogout, requireAdminAuth } from "@/lib/admin-auth";

interface Product {
  id: number;
  name: string;
  title?: string;
  description?: string;
  price: number;
  sale_price?: number;
  cost_price?: number;
  category: string;
  category_level1?: string;
  category_level2?: string;
  category_level3?: string;
  category_level4?: string;
  // Also support camelCase for compatibility with add product form
  categoryLevel1?: string;
  categoryLevel2?: string;
  categoryLevel3?: string;
  categoryLevel4?: string;
  brand: string | { id: number; brand_name: string; business_name?: string };
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  created_at: string;
  updated_at?: string;
  stock_quantity?: number;
  sku: string;
  barcode?: string;
  images?: string[];
  color_blocks?: Array<{
    id: string;
    color: string;
    new_color?: string;
    sizes: Array<{
      id: string;
      size: string;
      quantity: string;
    }>;
  }>;
  variants?: Array<{
    id: number;
    product_id: number;
    color_id: number;
    size_id: number;
    stock: number;
    lowStockThreshold: number;
    price: string;
    discount_price: string;
    cost_price?: string;
    sku: string;
    is_active: boolean;
    color?: { name: string };
    size?: { name: string };
  }>;
  tags?: string[];
  rating?: number;
  review_count?: number;
  total_sold?: number;
  revenue?: number;
  low_stock_threshold?: string;
  track_inventory?: boolean;
  allow_backorders?: boolean;
  max_order_quantity?: string;
  min_order_quantity?: string;
  shipping_weight?: string;
  shipping_class?: string;
  tax_class?: string;
  tax_rate?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  categories: number;
  totalRevenue: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categoryLevel2Filter, setCategoryLevel2Filter] = useState<string>('all');
  const [categoryLevel3Filter, setCategoryLevel3Filter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Stats state
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    categories: 0,
    totalRevenue: 0
  });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Variant management states
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    stock: 0,
    lowStockThreshold: 10,
    basePrice: '',
    salePrice: '',
    costPrice: ''
  });
  const [availableColors] = useState([
    'Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Brown', 
    'Pink', 'Purple', 'Yellow', 'Orange', 'Beige', 'Maroon', 'Teal', 
    'Cyan', 'Magenta', 'Lime', 'Olive', 'Silver', 'Gold', 'Indigo'
  ]);
  const [availableSizes] = useState([
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'
  ]);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, categoryLevel2Filter, categoryLevel3Filter, brandFilter, priceFilter]);

  // Check authentication on component mount
  useEffect(() => {
    requireAdminAuth(router);
    
    // Cleanup sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem('products_page_navigated_away');
    };
  }, [router]);

  // Add focus event listener to refresh products when returning to the page
  useEffect(() => {
    let lastUrl = window.location.href;
    
    const handleFocus = () => {
      const currentUrl = window.location.href;
      
      // Only reload if we're actually on the same products page (not switching between apps)
      if (currentUrl === lastUrl && currentUrl.includes('/admin/products')) {
        // Check if we're returning from add/edit page by looking at navigation history
        const hasNavigatedAway = sessionStorage.getItem('products_page_navigated_away');
        
        if (hasNavigatedAway === 'true') {
          console.log('Returning from add/edit page, refreshing products...');
          // Use a timeout to avoid calling loadProducts before it's defined
          setTimeout(() => {
            if (typeof loadProducts === 'function') {
              loadProducts();
            }
          }, 100);
          sessionStorage.removeItem('products_page_navigated_away');
        }
      }
      
      lastUrl = currentUrl;
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Show initial load notification
  useEffect(() => {
    if (!loading && products.length === 0) {
      toast.info('No products found. Add your first product to get started!');
    }
  }, [loading, products.length]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Prepare filters for API call
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category_level1 = categoryFilter;
      if (categoryLevel2Filter !== 'all') filters.category_level2 = categoryLevel2Filter;
      if (categoryLevel3Filter !== 'all') filters.category_level3 = categoryLevel3Filter;
      if (brandFilter !== 'all') filters.brand_id = brandFilter;
      if (searchTerm) filters.search = searchTerm;
      if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(p => p === '+' ? '1000' : p);
        if (min) filters.min_price = min;
        if (max && max !== '1000') filters.max_price = max;
      }

      console.log('Fetching products with filters:', filters);
      const response = await apiService.getProducts(currentPage, 12, filters);
      
      console.log('Raw API Response:', response);
      
      if (response && response.data) {
        let productsList: any[] = [];
        const responseData = response.data as any;
        
        // Handle different response structures
        if (Array.isArray(responseData)) {
          productsList = responseData;
        } else if (responseData.products && Array.isArray(responseData.products)) {
          productsList = responseData.products;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          productsList = responseData.data;
        } else {
          console.error('Unexpected API response structure:', responseData);
          
          // Check if we got brand data instead of product data
          if (responseData.brand_name || responseData.business_name) {
            toast.error('API returned brand data instead of product data. Please check the endpoint.');
          } else {
            toast.error('Invalid data format received from server');
          }
          
          setProducts([]);
          setStats({
            totalProducts: 0,
            activeProducts: 0,
            outOfStock: 0,
            categories: 0,
            totalRevenue: 0
          });
          return;
        }
        
        // Validate and clean products data
        const validProducts = productsList
          .filter((item: any) => {
            // Must be an object with required fields
            if (!item || typeof item !== 'object') return false;
            if (!item.id || !item.name) return false;
            
            // Ensure all required fields are strings/numbers, not objects
            if (typeof item.name !== 'string') return false;
            if (typeof item.id !== 'number') return false;
            
            // Skip if this looks like brand data instead of product data (but allow products with brand objects)
            if ((item.brand_name || item.business_name || item.tax_id) && !item.name) {
              console.warn('Skipping brand data found in products response:', item);
              return false;
            }
            
            return true;
          })
          .map((item: any) => {
            // Clean and normalize the product data
            const status = String(item.status || 'active');
            const validStatus: 'active' | 'inactive' | 'draft' | 'out_of_stock' = 
              (status === 'active' || status === 'inactive' || status === 'draft' || status === 'out_of_stock') 
                ? status 
                : 'active';
            
            return {
              id: Number(item.id) || 0,
              name: String(item.name || 'Unnamed Product'),
              title: String(item.title || item.name || ''),
              description: String(item.description || ''),
              price: Number(item.price) || 0,
              sale_price: item.sale_price ? Number(item.sale_price) : undefined,
              cost_price: item.cost_price ? Number(item.cost_price) : undefined,
              category: (() => {
                // Build clean category path from individual levels
                const categoryPath = [];
                
                // Add each level if it exists and is not empty
                if (item.categoryLevel1 || item.category_level1) {
                  const level1 = (item.categoryLevel1 || item.category_level1).toLowerCase();
                  categoryPath.push(level1);
                }
                
                if (item.categoryLevel2 || item.category_level2) {
                  const level2 = (item.categoryLevel2 || item.category_level2).toLowerCase();
                  categoryPath.push(level2);
                }
                
                if (item.categoryLevel3 || item.category_level3) {
                  const level3 = (item.categoryLevel3 || item.category_level3).toLowerCase();
                  categoryPath.push(level3);
                }
                
                // Add level4 - extract the actual category name from concatenated strings
                if (item.categoryLevel4 || item.category_level4) {
                  const level4 = (item.categoryLevel4 || item.category_level4);
                  
                  // If it's a concatenated string like "men-clothing-shirts-casual", extract the last part
                  if (level4.includes('-')) {
                    const parts = level4.split('-');
                    const lastPart = parts[parts.length - 1]; // Get "casual" from "men-clothing-shirts-casual"
                    if (lastPart && lastPart.length > 0) {
                      categoryPath.push(lastPart.toLowerCase());
                    }
                  } else if (level4.includes('_')) {
                    // Handle underscore-separated strings
                    const parts = level4.split('_');
                    const lastPart = parts[parts.length - 1];
                    if (lastPart && lastPart.length > 0) {
                      categoryPath.push(lastPart.toLowerCase());
                    }
                  } else {
                    // If it's a clean string, use it directly
                    categoryPath.push(level4.toLowerCase());
                  }
                }
                
                // Return the clean path or fallback
                return categoryPath.length > 0 ? categoryPath.join(' → ') : (item.category || 'unknown');
              })(),
              category_level1: String(item.category_level1 || item.categoryLevel1 || ''),
              category_level2: String(item.category_level2 || item.categoryLevel2 || ''),
              category_level3: String(item.category_level3 || item.categoryLevel3 || ''),
              category_level4: String(item.categoryLevel4 || item.category_level4 || ''),
              // Also support camelCase for compatibility
              categoryLevel1: String(item.categoryLevel1 || item.category_level1 || ''),
              categoryLevel2: String(item.categoryLevel2 || item.category_level2 || ''),
              categoryLevel3: String(item.categoryLevel3 || item.category_level3 || ''),
              categoryLevel4: String(item.categoryLevel4 || item.category_level4 || ''),
              brand: item.brand || 'Unknown Brand',
              status: validStatus,
              created_at: String(item.created_at || new Date().toISOString()),
              updated_at: item.updated_at ? String(item.updated_at) : undefined,
              stock_quantity: item.stock_quantity ? Number(item.stock_quantity) : 0,
              sku: String(item.sku || 'No SKU'),
              barcode: item.barcode ? String(item.barcode) : undefined,
              images: Array.isArray(item.images) ? item.images : [],
              color_blocks: Array.isArray(item.color_blocks) ? item.color_blocks : [],
              variants: Array.isArray(item.variants) ? item.variants : [],
              tags: Array.isArray(item.tags) ? item.tags : [],
              rating: item.rating ? Number(item.rating) : 0,
              review_count: item.review_count ? Number(item.review_count) : 0,
              total_sold: item.total_sold ? Number(item.total_sold) : 0,
              revenue: item.revenue ? Number(item.revenue) : 0,
              low_stock_threshold: item.low_stock_threshold ? String(item.low_stock_threshold) : undefined,
              track_inventory: Boolean(item.track_inventory),
              allow_backorders: Boolean(item.allow_backorders),
              max_order_quantity: item.max_order_quantity ? String(item.max_order_quantity) : undefined,
              min_order_quantity: item.min_order_quantity ? String(item.min_order_quantity) : '1',
              shipping_weight: item.shipping_weight ? String(item.shipping_weight) : undefined,
              shipping_class: item.shipping_class ? String(item.shipping_class) : undefined,
              tax_class: item.tax_class ? String(item.tax_class) : undefined,
              tax_rate: item.tax_rate ? String(item.tax_rate) : undefined,
              meta_title: item.meta_title ? String(item.meta_title) : undefined,
              meta_description: item.meta_description ? String(item.meta_description) : undefined,
              keywords: item.keywords ? String(item.keywords) : undefined
            } as Product;
          });
        
        console.log('Valid products after cleaning:', validProducts.length);
        console.log('Sample product:', validProducts[0]);
        console.log('Sample product variants:', validProducts[0]?.variants);
        console.log('Sample product stock_quantity:', validProducts[0]?.stock_quantity);
        console.log('Sample product category data:', {
          category: validProducts[0]?.category,
          category_level1: validProducts[0]?.category_level1,
          category_level2: validProducts[0]?.category_level2,
          category_level3: validProducts[0]?.category_level3,
          categoryLevel1: validProducts[0]?.categoryLevel1,
          categoryLevel2: validProducts[0]?.categoryLevel2,
          categoryLevel3: validProducts[0]?.categoryLevel3,
          categoryLevel4: validProducts[0]?.categoryLevel4
        });
        
        // Also log the raw API response for the first product
        if (productsList.length > 0) {
          console.log('Raw API response for first product:', productsList[0]);
          console.log('Raw API response - all keys:', Object.keys(productsList[0]));
          console.log('Raw API response - category related keys:', Object.keys(productsList[0]).filter(key => key.toLowerCase().includes('category')));
        }
        
        // Check if we got any valid products
        if (validProducts.length === 0 && productsList.length > 0) {
          console.warn('API returned data but no valid products after filtering');
          toast.warning('Products found but data format is unexpected. Check console for details.');
        }
        
        setProducts(validProducts);
        
        // Show success message if products were loaded
        if (validProducts.length > 0) {
          toast.success(`Loaded ${validProducts.length} products successfully`);
        }
        
        // Update stats if available
        if (responseData.stats) {
          setStats(responseData.stats);
        } else {
          // Calculate stats from products if not provided by API
          const totalProducts = responseData.total || validProducts.length || 0;
          const activeProducts = validProducts.filter((p: Product) => p.status === 'active').length;
          const outOfStock = validProducts.filter((p: Product) => p.status === 'out_of_stock' || (p.stock_quantity || 0) === 0).length;
          const totalRevenue = validProducts.reduce((sum: number, p: Product) => sum + (p.revenue || 0), 0);
        
        setStats({
          totalProducts,
          activeProducts,
          outOfStock,
            categories: 12, // Default value
          totalRevenue
        });
        }
        
        // Calculate total pages
        const total = responseData.total || validProducts.length || 0;
        setTotalPages(Math.ceil(total / 12));
        
      } else {
        console.error('No data in API response');
        toast.error('No data received from server');
        setProducts([]);
        setStats({
          totalProducts: 0,
          activeProducts: 0,
          outOfStock: 0,
          categories: 0,
          totalRevenue: 0
        });
      }
    } catch (error) {
      console.error('Error loading products:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load products. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Insufficient permissions.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      toast.error(errorMessage);
      
      // Fallback to empty state
      setProducts([]);
      setStats({
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
        categories: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, categoryFilter, categoryLevel2Filter, categoryLevel3Filter, brandFilter, priceFilter]);

  const handleAddProduct = () => {
    // Mark that we're navigating away from products page
    sessionStorage.setItem('products_page_navigated_away', 'true');
    router.push('/admin/products/add');
  };

  const handleEditProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Clean up variant SKUs before opening edit modal
      const cleanedProduct = { ...product };
      if (cleanedProduct.variants && Array.isArray(cleanedProduct.variants)) {
        const baseSku = getProductSKU(cleanedProduct);
        cleanedProduct.variants = cleanedProduct.variants.map(variant => ({
          ...variant,
          sku: `${baseSku}-${variant.color?.name?.toUpperCase() || 'UNKNOWN'}-${variant.size?.name?.toUpperCase() || 'UNKNOWN'}`
        }));
      }
      
      // Debug: Log category data to see what's available
      console.log('Product category data for edit:', {
        category_level1: cleanedProduct.category_level1,
        category_level2: cleanedProduct.category_level2,
        category_level3: cleanedProduct.category_level3,
        category_level4: cleanedProduct.category_level4,
        categoryLevel1: cleanedProduct.categoryLevel1,
        categoryLevel2: cleanedProduct.categoryLevel2,
        categoryLevel3: cleanedProduct.categoryLevel3,
        categoryLevel4: cleanedProduct.categoryLevel4,
        // Also check the raw product data
        rawProduct: {
          categoryLevel1: product.categoryLevel1,
          categoryLevel2: product.categoryLevel2,
          categoryLevel3: product.categoryLevel3,
          categoryLevel4: product.categoryLevel4,
          category_level1: product.category_level1,
          category_level2: product.category_level2,
          category_level3: product.category_level3,
          category_level4: product.category_level4
        }
      });
      
      setSelectedProduct(cleanedProduct);
      setEditModalOpen(true);
      // Reset variant management state
      setShowAddVariant(false);
      setNewVariant({
        color: '',
        size: '',
        stock: 0,
        lowStockThreshold: 10,
        basePrice: '',
        salePrice: '',
        costPrice: ''
      });
    }
  };

  const handleViewProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setViewModalOpen(true);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(productId);
        toast.success('Product deleted successfully');
        await loadProducts(); // Reload the products list
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    
    try {

      // Collect all form values from the controlled inputs
      // Use field names that match the ProductFormData interface
      const formData: Partial<ProductFormData> = {
        name: selectedProduct.name,
        title: selectedProduct.title || '',
        description: selectedProduct.description || '',
        sku: getProductSKU(selectedProduct),
        barcode: selectedProduct.barcode || '',
        brand: getBrandName(selectedProduct.brand), // Convert brand object to string
        status: selectedProduct.status,
        categoryLevel1: selectedProduct.category_level1 || selectedProduct.categoryLevel1 || '',
        categoryLevel2: selectedProduct.category_level2 || selectedProduct.categoryLevel2 || '',
        categoryLevel3: selectedProduct.category_level3 || selectedProduct.categoryLevel3 || '',
        categoryLevel4: selectedProduct.category_level4 || selectedProduct.categoryLevel4 || '',
        category: selectedProduct.category_level3 || selectedProduct.categoryLevel3 || '', // Use level3 as main category
        shippingWeight: selectedProduct.shipping_weight || '',
        shippingClass: selectedProduct.shipping_class || '',
        taxClass: selectedProduct.tax_class || '',
        taxRate: selectedProduct.tax_rate || '',
        metaTitle: selectedProduct.meta_title || '',
        metaDescription: selectedProduct.meta_description || '',
        keywords: selectedProduct.keywords || '',
        // Include ALL variants including new ones (don't filter out temporary ones)
        variants: selectedProduct.variants || [],
        // Additional fields that might be useful
        hasVariants: (selectedProduct.variants && selectedProduct.variants.length > 0) || false,
        variantType: 'color-size', // Default variant type for fashion products
        tags: selectedProduct.tags || [],
        images: selectedProduct.images || []
      };

      // Convert variants to colorBlocks format that the backend expects
      if (formData.variants && Array.isArray(formData.variants)) {
        // Group variants by color to create colorBlocks
        const colorGroups = new Map();
        
        formData.variants.forEach(variant => {
          const colorName = variant.color?.name || 'Unknown';
          const sizeName = variant.size?.name || 'Unknown';
          
          if (!colorGroups.has(colorName)) {
            colorGroups.set(colorName, {
              color: colorName,
              newColor: colorName,
              sizes: []
            });
          }
          
          const colorBlock = colorGroups.get(colorName);
          colorBlock.sizes.push({
            size: sizeName,
            quantity: variant.stock?.toString() || '0',
            lowStockThreshold: variant.lowStockThreshold?.toString() || '10',
            basePrice: variant.price?.toString() || '0',
            salePrice: variant.discount_price?.toString() || '0',
            costPrice: variant.cost_price?.toString() || '0'
          });
        });
        
        // Convert to array format
        const colorBlocks = Array.from(colorGroups.values());
        
        // Replace variants with colorBlocks
        delete formData.variants;
        formData.colorBlocks = colorBlocks;
        
        console.log('Converted variants to colorBlocks:', colorBlocks);
      }

      // Filter out empty values and ensure proper data types
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          // Skip undefined, null, and empty strings
          if (value === '' || value === null || value === undefined) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          
          // Skip variants if empty array
          if (key === 'variants' && Array.isArray(value) && value.length === 0) return false;
          
          return true;
        })
      );

      console.log('Form data to update:', filteredFormData);
      console.log('All variants (including temporary):', selectedProduct.variants);
      console.log('Converted colorBlocks for backend:', formData.colorBlocks);

      // Call API to update product
      await apiService.updateProduct(selectedProduct.id, filteredFormData);
      
      toast.success('Product updated successfully!');
      
      // Refresh the products list
      await loadProducts();
      
      // Close the modal
      setEditModalOpen(false);
      setSelectedProduct(null);
      
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  // Variant management functions
  const handleAddNewVariant = () => {
    setShowAddVariant(true);
    setNewVariant({
      color: '',
      size: '',
      stock: 0,
      lowStockThreshold: 10,
      basePrice: '',
      salePrice: '',
      costPrice: ''
    });
  };

  const handleSaveNewVariant = async () => {
    if (!selectedProduct || !newVariant.color || !newVariant.size) {
      toast.error('Please fill in all required fields for the new variant.');
      return;
    }

    try {
      // Check if variant already exists
      const existingVariant = selectedProduct.variants?.find(
        v => v.color?.name === newVariant.color && v.size?.name === newVariant.size
      );

      if (existingVariant) {
        toast.error('This color/size combination already exists for this product.');
        return;
      }

      // Generate new variant SKU
      // Use the product's base SKU and append color and size
      const baseSku = selectedProduct.sku || 'PROD';
      
      // Clean the base SKU to remove any existing variant suffixes
      const cleanBaseSku = baseSku.split('-').slice(0, 1).join('-');
      
      const newVariantSku = `${cleanBaseSku}-${newVariant.color.toUpperCase()}-${newVariant.size.toUpperCase()}`;
      
      console.log('SKU Generation:', {
        baseSku: cleanBaseSku,
        color: newVariant.color.toUpperCase(),
        size: newVariant.size.toUpperCase(),
        finalSku: newVariantSku
      });

      // Create new variant object for immediate UI display
      const newVariantObject = {
        id: -(Date.now()), // Use negative timestamp as temporary ID to avoid conflicts
        product_id: selectedProduct.id,
        color_id: 0, // Temporary color_id
        size_id: 0, // Temporary size_id
        stock: newVariant.stock,
        lowStockThreshold: newVariant.lowStockThreshold,
        price: newVariant.basePrice || '0',
        discount_price: newVariant.salePrice || '0',
        cost_price: newVariant.costPrice || '0',
        sku: newVariantSku,
        is_active: true,
        color: { name: newVariant.color },
        size: { name: newVariant.size }
      };

      // Add new variant to the product's variants array immediately
      const updatedVariants = [
        ...(selectedProduct.variants || []),
        newVariantObject
      ];

      // Update the selected product state to show the new variant immediately
      setSelectedProduct(prev => prev ? { ...prev, variants: updatedVariants } as Product : null);
      
      toast.success('New variant added successfully! You can now see it in the list below.');
      
      // Reset form and hide add variant section
      setShowAddVariant(false);
      setNewVariant({
        color: '',
        size: '',
        stock: 0,
        lowStockThreshold: 10,
        basePrice: '',
        salePrice: '',
        costPrice: ''
      });
      
      // Note: Variant is now visible in the UI and will be saved when you click "Save Changes"
      
    } catch (error) {
      console.error('Error adding new variant:', error);
      toast.error('Failed to add new variant. Please try again.');
    }
  };

  const handleCancelAddVariant = () => {
    setShowAddVariant(false);
    setNewVariant({
      color: '',
      size: '',
      stock: 0,
      lowStockThreshold: 10,
      basePrice: '',
      salePrice: '',
      costPrice: ''
    });
  };

  const handleVariantUpdate = async (variantId: number, field: string, value: any) => {
    if (!selectedProduct) return;

    try {
      // Update variant in local state first for immediate UI feedback
      const updatedVariants = selectedProduct.variants?.map(variant => 
        variant.id === variantId ? { ...variant, [field]: value } : variant
      );

      setSelectedProduct(prev => prev ? { ...prev, variants: updatedVariants } : null);

      // Variant updated in UI - will be saved when you click "Save Changes"
      toast.success('Variant updated successfully!');
      
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant. Please try again.');
      
      // Revert local state on error
      await loadProducts();
    }
  };

  const handleVariantDelete = async (variantId: number) => {
    if (!selectedProduct || !confirm('Are you sure you want to delete this variant?')) return;

    try {
      // Remove variant from local state for immediate UI feedback
      const updatedVariants = selectedProduct.variants?.filter(variant => variant.id !== variantId);
      setSelectedProduct(prev => prev ? { ...prev, variants: updatedVariants } : null);

      // Variant removed from UI - will be saved when you click "Save Changes"
      toast.success('Variant removed successfully!');
      
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant. Please try again.');
      
      // Revert local state on error
      await loadProducts();
    }
  };



  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCategoryLevel2Filter('all');
    setCategoryLevel3Filter('all');
  };

  const handleCategoryLevel2FilterChange = (value: string) => {
    setCategoryLevel2Filter(value);
    setCategoryLevel3Filter('all');
  };

  const handleLogout = () => {
    adminLogout(router);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <X className="h-4 w-4" />;
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'out_of_stock': return <AlertTriangle className="h-4 w-4" />;
      default: return <X className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    // Handle full category paths by checking the first level
    const firstLevel = category.split(' → ')[0]?.toLowerCase();
    
    switch (firstLevel) {
      case 'men': return 'bg-blue-100 text-blue-800';
      case 'women': return 'bg-pink-100 text-pink-800';
      case 'clothing': return 'bg-blue-100 text-blue-800';
      case 'electronics': return 'bg-green-100 text-green-800';
      case 'home': return 'bg-yellow-100 text-yellow-800';
      case 'sports': return 'bg-purple-100 text-purple-800';
      case 'beauty': return 'bg-pink-100 text-pink-800';
      case 'accessories': return 'bg-indigo-100 text-indigo-800';
      case 'shoes': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total stock quantity from variants or color blocks
  const getTotalStock = (product: Product) => {
    if (!product) return 0;
    
    // Always check variants first - this is the source of truth for stock
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      const totalStock = product.variants.reduce((total, variant) => {
        return total + (variant.stock || 0);
      }, 0);
      console.log(`Product ${product.name} - Variants stock:`, product.variants.map(v => ({ id: v.id, stock: v.stock })), 'Total:', totalStock);
      return totalStock;
    }
    
    // Fallback to product-level stock_quantity
    if (product.stock_quantity !== undefined && product.stock_quantity > 0) {
      console.log(`Product ${product.name} - Product-level stock:`, product.stock_quantity);
      return product.stock_quantity;
    }
    
    // Fallback to old color_blocks structure
    if (product.color_blocks && Array.isArray(product.color_blocks)) {
      const totalStock = product.color_blocks.reduce((total, block) => {
        if (!block || !Array.isArray(block.sizes)) return total;
        return total + block.sizes.reduce((blockTotal, size) => {
          return blockTotal + parseInt(size.quantity || '0');
        }, 0);
      }, 0);
      console.log(`Product ${product.name} - Color blocks stock:`, totalStock);
      return totalStock;
    }
    
    console.log(`Product ${product.name} - No stock data found`);
    return 0;
  };

  // Get colors from variants or color blocks
  const getProductColors = (product: Product) => {
    if (!product) return [];
    
    // Check for new variants structure first
    if (product.variants && Array.isArray(product.variants)) {
      const colors = new Set<string>();
      product.variants.forEach(variant => {
        if (variant.color && variant.color.name) {
          colors.add(variant.color.name);
        }
      });
      return Array.from(colors);
    }
    
    // Fallback to old color_blocks structure
    if (product.color_blocks && Array.isArray(product.color_blocks)) {
      return product.color_blocks
        .filter(block => block && (block.color || block.new_color))
        .map(block => block.color || block.new_color)
        .filter(Boolean);
    }
    
    return [];
  };

  // Get sizes from variants or color blocks
  const getProductSizes = (product: Product) => {
    if (!product) return [];
    
    // Check for new variants structure first
    if (product.variants && Array.isArray(product.variants)) {
      const sizes = new Set<string>();
      product.variants.forEach(variant => {
        if (variant.size && variant.size.name) {
          sizes.add(variant.size.name);
        }
      });
      return Array.from(sizes);
    }
    
    // Fallback to old color_blocks structure
    if (product.color_blocks && Array.isArray(product.color_blocks)) {
      const sizes = new Set<string>();
      product.color_blocks.forEach(block => {
        if (block && Array.isArray(block.sizes)) {
          block.sizes.forEach(size => {
            if (size && size.size) sizes.add(size.size);
          });
        }
      });
      return Array.from(sizes);
    }
    
    return [];
  };

  // Get brand name from brand object or string
  const getBrandName = (brand: string | { id: number; brand_name: string; business_name?: string } | undefined) => {
    if (!brand) return 'Unknown';
    if (typeof brand === 'string') return brand;
    if (typeof brand === 'object' && brand.brand_name) return brand.brand_name;
    return 'Unknown';
  };

  // Get price from variants or fallback to product price
  const getProductPrice = (product: Product) => {
    if (product.price && product.price > 0) return product.price;
    
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      // Get the first variant with a price
      const variantWithPrice = product.variants.find(variant => variant.price && parseFloat(variant.price) > 0);
      if (variantWithPrice) {
        return parseFloat(variantWithPrice.price);
      }
    }
    
    return 0;
  };

  // Helper function to extract category level 3 from category string
  const extractCategoryLevel3 = (categoryString: string | undefined): string => {
    if (!categoryString) return '';
    
    // Handle category strings like "men-clothing-shirts-casual" or "men → clothing → shirts → casual"
    if (categoryString.includes('-')) {
      const parts = categoryString.split('-');
      if (parts.length >= 3) {
        return parts[2]; // Return "shirts" from "men-clothing-shirts-casual"
      }
    } else if (categoryString.includes('→')) {
      const parts = categoryString.split('→').map(part => part.trim());
      if (parts.length >= 3) {
        return parts[2]; // Return "shirts" from "men → clothing → shirts → casual"
      }
    }
    
    return '';
  };

  // Get clean base SKU from product or extract from first variant
  const getProductSKU = (product: Product) => {
    if (product.sku && product.sku !== 'No SKU') {
      // Clean the SKU to remove any variant suffixes
      const cleanSku = product.sku.split('-').slice(0, 1).join('-');
      return cleanSku;
    }
    
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      // Get the first variant with a SKU and extract base
      const variantWithSKU = product.variants.find(variant => variant.sku && variant.sku.trim() !== '');
      if (variantWithSKU) {
        const cleanSku = variantWithSKU.sku.split('-').slice(0, 1).join('-');
        return cleanSku;
      }
    }
    
    return 'No SKU';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-56 bg-blue-200 border-r border-blue-300">
        <div className="p-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">TAD</h2>
          <nav className="space-y-1">
            <button 
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => router.push('/admin/users')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </button>
            <button 
              onClick={() => router.push('/admin/brands')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Tag className="h-4 w-4" />
              <span>Brands</span>
            </button>
            <button 
              onClick={() => router.push('/admin/products')}
              className="flex items-center space-x-3 py-2 rounded-lg bg-blue-600 text-white shadow-md text-sm w-full text-left px-3"
            >
              <Box className="h-4 w-4" />
              <span className="font-medium">Products</span>
            </button>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Clipboard className="h-4 w-4" />
              <span>Orders</span>
            </button>
            <button 
              onClick={() => router.push('/admin/payments')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </button>
            <button 
              onClick={() => router.push('/admin/logistics')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Truck className="h-4 w-4" />
              <span>Logistics</span>
            </button>
            <button 
              onClick={() => router.push('/admin/analytics')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
            <button 
              onClick={() => router.push('/admin/marketing')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Megaphone className="h-4 w-4" />
              <span>Marketing & Promotions</span>
            </button>
            <button 
              onClick={() => router.push('/admin/settings')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => router.push('/admin/support')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm w-full text-left"
            >
              <Mail className="h-4 w-4" />
              <span>Support inbox</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage product catalog and inventory</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Tuesday, April 23, 2024</div>
                <div className="text-sm text-gray-500">11:45 AM</div>
              </div>
              
              <div className="relative user-dropdown">
                <Button
                  variant="ghost"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>Tanvir</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                  </div>
                  <Tag className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search, Filters and Add Product Section */}
          <div className="mb-6 space-y-4">
            {/* Search and Add Product */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={loadProducts}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <div className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setDebugMode(!debugMode)}
                  className={`flex items-center space-x-2 ${debugMode ? 'bg-yellow-100 border-yellow-300' : ''}`}
                >
                  <Cog className="h-4 w-4" />
                  <span>Debug</span>
                </Button>
                
                <Button 
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-level1-filter" className="text-sm font-medium text-gray-700">Target Audience</Label>
                    <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Audiences" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Audiences</SelectItem>
                        <SelectItem value="men">MEN</SelectItem>
                        <SelectItem value="women">WOMEN</SelectItem>
                        <SelectItem value="kids">KIDS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-level2-filter" className="text-sm font-medium text-gray-700">Category Type</Label>
                    <Select 
                      value={categoryLevel2Filter} 
                      onValueChange={handleCategoryLevel2FilterChange}
                      disabled={categoryFilter === 'all'}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {categoryFilter !== 'all' && (
                          <>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="shoes">Shoes</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-level3-filter" className="text-sm font-medium text-gray-700">Sub Category</Label>
                    <Select 
                      value={categoryLevel3Filter} 
                      onValueChange={setCategoryLevel3Filter}
                      disabled={categoryLevel2Filter === 'all'}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Sub Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sub Categories</SelectItem>
                        {categoryFilter === 'men' && categoryLevel2Filter === 'clothing' && (
                          <>
                            <SelectItem value="T-shirts">T-shirts</SelectItem>
                            <SelectItem value="Polo Shirts">Polo Shirts</SelectItem>
                            <SelectItem value="Shirts">Shirts</SelectItem>
                            <SelectItem value="Hoodies">Hoodies</SelectItem>
                            <SelectItem value="Pants">Pants</SelectItem>
                          </>
                        )}
                        {categoryFilter === 'women' && categoryLevel2Filter === 'clothing' && (
                          <>
                            <SelectItem value="Salwar Kameez">Salwar Kameez</SelectItem>
                            <SelectItem value="Sarees">Sarees</SelectItem>
                            <SelectItem value="Kurtis">Kurtis</SelectItem>
                            <SelectItem value="T-shirts">T-shirts</SelectItem>
                            <SelectItem value="Tops">Tops</SelectItem>
                          </>
                        )}
                        {categoryFilter === 'kids' && categoryLevel2Filter === 'clothing' && (
                          <>
                            <SelectItem value="Baby (0-12 months)">Baby (0-12 months)</SelectItem>
                            <SelectItem value="Toddler Girls (1-3 years)">Toddler Girls (1-3 years)</SelectItem>
                            <SelectItem value="Toddler Boys (1-3 years)">Toddler Boys (1-3 years)</SelectItem>
                            <SelectItem value="Kid Girls (3-6 years)">Kid Girls (3-6 years)</SelectItem>
                            <SelectItem value="Kid Boys (3-6 years)">Kid Boys (3-6 years)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand-filter" className="text-sm font-medium text-gray-700">Brand</Label>
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        <SelectItem value="Fashion Forward">Fashion Forward</SelectItem>
                        <SelectItem value="TechGear Pro">TechGear Pro</SelectItem>
                        <SelectItem value="Home & Garden Co">Home & Garden Co</SelectItem>
                        <SelectItem value="Sports Elite">Sports Elite</SelectItem>
                        <SelectItem value="Beauty Plus">Beauty Plus</SelectItem>
                        <SelectItem value="Urban Style">Urban Style</SelectItem>
                        <SelectItem value="Classic Collection">Classic Collection</SelectItem>
                        <SelectItem value="Premium Brands">Premium Brands</SelectItem>
                        <SelectItem value="Sportswear Pro">Sportswear Pro</SelectItem>
                        <SelectItem value="Casual Comfort">Casual Comfort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-filter" className="text-sm font-medium text-gray-700">Price Range</Label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="0-25">$0 - $25</SelectItem>
                        <SelectItem value="25-50">$25 - $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100+">$100+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Clear Filters Button */}
                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setCategoryLevel2Filter('all');
                      setCategoryLevel3Filter('all');
                      setBrandFilter('all');
                      setPriceFilter('all');
                      setSearchTerm('');
                    }}
                    className="px-6"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Debug Information */}
          {debugMode && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-yellow-700 space-y-2">
                <div><strong>Products Count:</strong> {products.length}</div>
                <div><strong>Loading State:</strong> {loading ? 'Yes' : 'No'}</div>
                <div><strong>Current Page:</strong> {currentPage}</div>
                <div><strong>Total Pages:</strong> {totalPages}</div>
                <div><strong>Search Term:</strong> {searchTerm || 'None'}</div>
                <div><strong>Status Filter:</strong> {statusFilter}</div>
                <div><strong>Category Level 1:</strong> {categoryFilter}</div>
                <div><strong>Category Level 2:</strong> {categoryLevel2Filter}</div>
                <div><strong>Category Level 3:</strong> {categoryLevel3Filter}</div>
                <div><strong>Brand Filter:</strong> {brandFilter}</div>
                <div><strong>Price Filter:</strong> {priceFilter}</div>
                <div><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</div>
                <div><strong>Products Data:</strong> {JSON.stringify(products.slice(0, 2), null, 2)}</div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Product Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {loading ? 'Loading products...' : 'No products match your current filters or the API is not available.'}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button onClick={loadProducts} variant="outline" className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                  </Button>
                <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.filter(product => product && product.id && product.name).map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name || 'Product'} className="w-6 h-6 rounded" />
                          ) : (
                            <Image className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{product.name || 'Unnamed Product'}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {product.description || product.title || 'No description available'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(product.status)}
                        <Badge className={`${getStatusColor(product.status)} text-xs`}>
                          {product.status.replace('_', ' ').charAt(0).toUpperCase() + product.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Category and Brand */}
                    <div className="flex items-center justify-between">
                                             <Badge variant="outline" className={`${getCategoryColor(product.category || '')} text-xs max-w-full truncate`}>
                         {product.category || 'Unknown'}
                       </Badge>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{getBrandName(product.brand)}</p>
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold text-green-600">${getProductPrice(product)}</p>
                          {product.sale_price && (
                            <p className="text-xs text-gray-400 line-through">${product.sale_price}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className={`text-sm font-semibold ${getTotalStock(product) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {getTotalStock(product)}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{product.total_sold || 0}</p>
                        <p className="text-xs text-gray-500">Sold</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">${(product.revenue || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">{product.rating || 0}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>

                    {/* SKU and Colors */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-xs">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{getProductSKU(product)}</span>
                      </div>
                      {getProductColors(product).length > 0 && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Palette className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{getProductColors(product).length} colors</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Date unknown'}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                          className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product.id)}
                          className="text-gray-600 hover:text-gray-700 h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Product Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Product Details: {selectedProduct.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Title</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.title || 'No title'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge className={getStatusColor(selectedProduct.status)}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Brand</Label>
                    <p className="text-sm text-gray-900">{getBrandName(selectedProduct.brand)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">SKU</Label>
                    <p className="text-sm text-gray-900">{getProductSKU(selectedProduct)}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Pricing Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Base Price</Label>
                    <p className="text-sm text-gray-900">${getProductPrice(selectedProduct)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sale Price</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.sale_price ? `$${selectedProduct.sale_price}` : 'No sale price'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cost Price</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.cost_price ? `$${selectedProduct.cost_price}` : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Inventory Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Inventory Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Total Stock</Label>
                    <p className="text-sm text-gray-900">{getTotalStock(selectedProduct)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Track Inventory</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.track_inventory ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Allow Backorders</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.allow_backorders ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Min Order Quantity</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.min_order_quantity || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Variants Information */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">Product Variants</h3>
                  <div className="space-y-3">
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={variant.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Color</Label>
                            <p className="text-gray-900">{variant.color?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Size</Label>
                            <p className="text-gray-900">{variant.size?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Stock</Label>
                            <p className="text-gray-900">{variant.stock}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Price</Label>
                            <p className="text-gray-900">${variant.price || '0'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Low Stock Threshold</Label>
                            <p className="text-gray-900">{variant.lowStockThreshold || 'Not set'}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700">SKU</Label>
                            <p className="text-gray-900">{variant.sku}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Status</Label>
                            <Badge className={variant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {variant.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedProduct.description && (
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-sm text-gray-900">{selectedProduct.description}</p>
                </div>
              )}

              {/* Additional Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Barcode</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.barcode || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Shipping Weight</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.shipping_weight || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Shipping Class</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.shipping_class || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tax Class</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.tax_class || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">SEO & Meta Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Meta Title</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.meta_title || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.meta_description || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Keywords</Label>
                    <p className="text-sm text-gray-900">{selectedProduct.keywords || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created At</Label>
                    <p className="text-sm text-gray-900">
                      {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Updated At</Label>
                    <p className="text-sm text-gray-900">
                      {selectedProduct.updated_at ? new Date(selectedProduct.updated_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Product: {selectedProduct.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditModalOpen(false);
                  // Reset variant management state
                  setShowAddVariant(false);
                  setNewVariant({
                    color: '',
                    size: '',
                    stock: 0,
                    lowStockThreshold: 10,
                    basePrice: '',
                    salePrice: '',
                    costPrice: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Package className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-brand" className="block mb-2 text-sm font-medium">Brand *</Label>
                    <Input
                      id="edit-brand"
                      defaultValue={getBrandName(selectedProduct.brand)}
                      className="h-10 w-full"
                      readOnly
                      disabled
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-name" className="block mb-2 text-sm font-medium">Product Name *</Label>
                    <Input
                      id="edit-name"
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-sku" className="block mb-2 text-sm font-medium">Base SKU *</Label>
                    <Input
                      id="edit-sku"
                      defaultValue={getProductSKU(selectedProduct)}
                      className="h-10 w-full"
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is the base SKU. Variant SKUs will be generated as: BaseSKU-Color-Size (e.g., 4654564-BLUE-L)
                    </p>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-title" className="block mb-2 text-sm font-medium">Product Title *</Label>
                    <Input
                      id="edit-title"
                      value={selectedProduct.title || ''}
                      onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description" className="block mb-2">Description</Label>
                  <textarea
                    id="edit-description"
                    value={selectedProduct.description || ''}
                    onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-categoryLevel1" className="block mb-2 text-sm font-medium">Target Audience *</Label>
                    <Select value={selectedProduct.category_level1 || selectedProduct.categoryLevel1 || ''} onValueChange={(value) => {
                      setSelectedProduct(prev => prev ? { ...prev, category_level1: value, categoryLevel1: value } : null);
                    }}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">MEN</SelectItem>
                        <SelectItem value="women">WOMEN</SelectItem>
                        <SelectItem value="kids">KIDS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-categoryLevel2" className="block mb-2 text-sm font-medium">Category Type *</Label>
                    <Select value={selectedProduct.category_level2 || selectedProduct.categoryLevel2 || ''} onValueChange={(value) => {
                      setSelectedProduct(prev => prev ? { ...prev, category_level2: value, categoryLevel2: value } : null);
                    }}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-categoryLevel3" className="block mb-2 text-sm font-medium">Category Sub-Type *</Label>
                    {(() => {
                      const categoryValue = selectedProduct.category_level3 || selectedProduct.categoryLevel3 || extractCategoryLevel3(selectedProduct.category) || '';
                      
                      // Additional fallback: try to extract from category string more aggressively
                      let fallbackValue = '';
                      if (selectedProduct.category) {
                        const categoryStr = selectedProduct.category.toLowerCase();
                        if (categoryStr.includes('shirts') || categoryStr.includes('t-shirts')) {
                          fallbackValue = 'shirts';
                        } else if (categoryStr.includes('pants') || categoryStr.includes('jeans')) {
                          fallbackValue = 'pants';
                        } else if (categoryStr.includes('dresses')) {
                          fallbackValue = 'dresses';
                        } else if (categoryStr.includes('shoes') || categoryStr.includes('sneakers')) {
                          fallbackValue = 'sneakers';
                        } else if (categoryStr.includes('accessories') || categoryStr.includes('watches')) {
                          fallbackValue = 'watches';
                        }
                      }
                      
                      const finalCategoryValue = categoryValue || fallbackValue;
                      const categoryLevel1 = selectedProduct.category_level1 || selectedProduct.categoryLevel1 || '';
                      const categoryLevel2 = selectedProduct.category_level2 || selectedProduct.categoryLevel2 || '';
                      
                      console.log('Category Sub-Type field value:', {
                        category_level3: selectedProduct.category_level3,
                        categoryLevel3: selectedProduct.categoryLevel3,
                        category: selectedProduct.category,
                        extracted: extractCategoryLevel3(selectedProduct.category),
                        fallbackValue,
                        finalCategoryValue,
                        categoryLevel1,
                        categoryLevel2,
                        // Debug: Check all possible field variations
                        allFields: {
                          'category_level3': selectedProduct.category_level3,
                          'categoryLevel3': selectedProduct.categoryLevel3,
                          'category_level_3': (selectedProduct as any).category_level_3,
                          'categoryLevel_3': (selectedProduct as any).categoryLevel_3
                        }
                      });
                      
                      // Dynamic category options based on selected levels (same logic as add product form)
                      const getCategoryOptions = () => {
                        if (!categoryLevel1 || !categoryLevel2) return [];
                        
                        const categoryData = {
                          men: {
                            clothing: ['T-shirts', 'Polo Shirts', 'Shirts', 'Hoodies', 'Pants', 'Jeans', 'Shorts', 'Jackets', 'Blazers', 'Suits'],
                            shoes: ['Sneakers', 'Formal Shoes', 'Casual Shoes', 'Sports Shoes', 'Boots', 'Sandals'],
                            accessories: ['Watches', 'Belts', 'Wallets', 'Bags', 'Hats', 'Sunglasses', 'Ties', 'Cufflinks']
                          },
                          women: {
                            clothing: ['Salwar Kameez', 'Sarees', 'Kurtis', 'T-shirts', 'Tops', 'Dresses', 'Jeans', 'Pants', 'Skirts', 'Blouses'],
                            shoes: ['Heels', 'Flats', 'Sneakers', 'Sandals', 'Boots', 'Wedges'],
                            accessories: ['Jewelry', 'Handbags', 'Scarves', 'Belts', 'Watches', 'Sunglasses']
                          },
                          kids: {
                            clothing: ['T-shirts', 'Dresses', 'Pants', 'Shorts', 'Shirts', 'Sweaters', 'Jackets'],
                            shoes: ['Sneakers', 'Sandals', 'Formal Shoes', 'Casual Shoes'],
                            accessories: ['Hats', 'Belts', 'Bags', 'Watches']
                          }
                        };
                        
                        return categoryData[categoryLevel1 as keyof typeof categoryData]?.[categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] || [];
                      };
                      
                      const categoryOptions = getCategoryOptions();
                      
                      return (
                        <Select value={finalCategoryValue} onValueChange={(value) => {
                          setSelectedProduct(prev => prev ? { ...prev, category_level3: value, categoryLevel3: value } : null);
                        }}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select sub-category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    })()}
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-categoryLevel4" className="block mb-2 text-sm font-medium">Specific Item *</Label>
                    <Input
                      id="edit-categoryLevel4"
                      value={selectedProduct.category_level4 || selectedProduct.categoryLevel4 || ''}
                      onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, category_level4: e.target.value, categoryLevel4: e.target.value } : null)}
                      placeholder="e.g., Basic T-shirts, Printed T-shirts"
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-status" className="block mb-2 text-sm font-medium">Status *</Label>
                    <Select value={selectedProduct.status} onValueChange={(value) => {
                      setSelectedProduct(prev => prev ? { ...prev, status: value as 'active' | 'inactive' | 'draft' | 'out_of_stock' } : null);
                    }}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-barcode" className="block mb-2 text-sm font-medium">Barcode</Label>
                    <Input
                      id="edit-barcode"
                      value={selectedProduct.barcode || ''}
                      onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, barcode: e.target.value } : null)}
                      placeholder="Enter barcode"
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Color Blocks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-semibold">Color Variants & Pricing</h3>
                  </div>
                  <Button
                    onClick={handleAddNewVariant}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={showAddVariant}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Variant
                  </Button>
                </div>
                
                {/* Add New Variant Form */}
                {showAddVariant && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900 text-lg">Add New Variant</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelAddVariant}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Info notice */}
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
                      <p className="text-sm text-blue-800">
                        <Info className="h-4 w-4 inline mr-2" />
                        <strong>Note:</strong> New variants will appear immediately in the list below. Click "Save Changes" to persist them to the database.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Color *</Label>
                        <Select value={newVariant.color} onValueChange={(value) => setNewVariant(prev => ({ ...prev, color: value }))}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Size *</Label>
                        <Select value={newVariant.size} onValueChange={(value) => setNewVariant(prev => ({ ...prev, size: value }))}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Stock Quantity</Label>
                        <Input
                          type="number"
                          value={newVariant.stock}
                          onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          className="h-10 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Low Stock Threshold</Label>
                        <Input
                          type="number"
                          value={newVariant.lowStockThreshold}
                          onChange={(e) => setNewVariant(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                          className="h-10 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Base Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newVariant.basePrice}
                          onChange={(e) => setNewVariant(prev => ({ ...prev, basePrice: e.target.value }))}
                          placeholder="0.00"
                          className="h-10 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Sale Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newVariant.salePrice}
                          onChange={(e) => setNewVariant(prev => ({ ...prev, salePrice: e.target.value }))}
                          placeholder="0.00"
                          className="h-10 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label className="block mb-2 text-sm font-medium text-blue-900">Cost Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newVariant.costPrice}
                          onChange={(e) => setNewVariant(prev => ({ ...prev, costPrice: e.target.value }))}
                          placeholder="0.00"
                          className="h-10 w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleCancelAddVariant}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveNewVariant}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newVariant.color || !newVariant.size}
                      >
                        Add Variant
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Existing Variants */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                  <div className="space-y-4">
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={variant.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Color: {variant.color?.name || 'Unknown'} | Size: {variant.size?.name || 'Unknown'}
                            </h4>
                            {variant.id < 0 && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                New (Temporary)
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVariantDelete(variant.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Stock Quantity</Label>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantUpdate(variant.id, 'stock', parseInt(e.target.value) || 0)}
                              className="h-10 w-full"
                            />
                          </div>
                          
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Low Stock Threshold</Label>
                            <Input
                              type="number"
                              value={variant.lowStockThreshold || 0}
                              onChange={(e) => handleVariantUpdate(variant.id, 'lowStockThreshold', parseInt(e.target.value) || 0)}
                              className="h-10 w-full"
                            />
                          </div>
                          
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Base Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variant.price || ''}
                              onChange={(e) => handleVariantUpdate(variant.id, 'price', e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                          
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Sale Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variant.discount_price || ''}
                              onChange={(e) => handleVariantUpdate(variant.id, 'discount_price', e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                          
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Cost Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variant.cost_price || ''}
                              onChange={(e) => handleVariantUpdate(variant.id, 'cost_price', e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="block mb-2 text-sm font-medium">SKU</Label>
                          <Input
                            value={variant.sku}
                            onChange={(e) => handleVariantUpdate(variant.id, 'sku', e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No variants found for this product.</p>
                  </div>
                )}
              </div>

              {/* Inventory Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Hash className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-semibold">Inventory & Stock</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-min-order" className="block mb-2 text-sm font-medium">Minimum Order Quantity</Label>
                    <Input
                      id="edit-min-order"
                      type="number"
                      defaultValue={selectedProduct.min_order_quantity || '1'}
                      className="h-10 w-full"
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-max-order" className="block mb-2 text-sm font-medium">Maximum Order Quantity</Label>
                    <Input
                      id="edit-max-order"
                      type="number"
                      defaultValue={selectedProduct.max_order_quantity || ''}
                      className="h-10 w-full"
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-shipping-weight" className="block mb-2 text-sm font-medium">Shipping Weight (kg)</Label>
                    <Input
                      id="edit-shipping-weight"
                      type="number"
                      step="0.01"
                      defaultValue={selectedProduct.shipping_weight || ''}
                      className="h-10 w-full"
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-shipping-class" className="block mb-2 text-sm font-medium">Shipping Class</Label>
                    <Input
                      id="edit-shipping-class"
                      defaultValue={selectedProduct.shipping_class || ''}
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-track-inventory" className="block mb-2 text-sm font-medium">Track Inventory</Label>
                    <Select defaultValue={selectedProduct.track_inventory ? 'true' : 'false'}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-allow-backorders" className="block mb-2 text-sm font-medium">Allow Backorders</Label>
                    <Select defaultValue={selectedProduct.allow_backorders ? 'true' : 'false'}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* SEO & Meta Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold">SEO & Meta Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-meta-title" className="block mb-2 text-sm font-medium">Meta Title</Label>
                    <Input
                      id="edit-meta-title"
                      defaultValue={selectedProduct.meta_title || ''}
                      placeholder="Enter meta title for SEO"
                      className="h-10 w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-meta-description" className="block mb-2 text-sm font-medium">Meta Description</Label>
                    <textarea
                      id="edit-meta-description"
                      defaultValue={selectedProduct.meta_description || ''}
                      placeholder="Enter meta description for SEO"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-keywords" className="block mb-2 text-sm font-medium">Keywords</Label>
                    <Input
                      id="edit-keywords"
                      defaultValue={selectedProduct.keywords || ''}
                      placeholder="Enter keywords separated by commas"
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Tax & Shipping Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Truck className="h-4 w-4 text-orange-600" />
                  <h3 className="text-sm font-semibold">Tax & Shipping</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="edit-tax-class" className="block mb-2 text-sm font-medium">Tax Class</Label>
                    <Input
                      id="edit-tax-class"
                      defaultValue={selectedProduct.tax_class || ''}
                      placeholder="Enter tax class"
                      className="h-10 w-full"
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="edit-tax-rate" className="block mb-2 text-sm font-medium">Tax Rate (%)</Label>
                    <Input
                      id="edit-tax-rate"
                      type="number"
                      step="0.01"
                      defaultValue={selectedProduct.tax_rate || ''}
                      placeholder="Enter tax rate percentage"
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 