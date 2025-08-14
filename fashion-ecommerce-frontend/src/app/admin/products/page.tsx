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
  Image, Palette, Ruler, Hash, RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

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
  brand: string;
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

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, categoryLevel2Filter, categoryLevel3Filter, brandFilter, priceFilter]);

  // Add focus event listener to refresh products when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      // Refresh products when the page gains focus (user returns from add/edit page)
        loadProducts();
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Prepare filters for API call
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category_level1 = categoryFilter;
      if (categoryLevel2Filter !== 'all') filters.category_level2 = categoryLevel2Filter;
      if (categoryLevel3Filter !== 'all') filters.category_level3 = categoryLevel3Filter;
      if (brandFilter !== 'all') filters.brand = brandFilter;
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
            
            // Skip if this looks like brand data instead of product data
            if (item.brand_name || item.business_name || item.tax_id) {
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
              category: String(item.category || 'unknown'),
              category_level1: String(item.category_level1 || ''),
              category_level2: String(item.category_level2 || ''),
              category_level3: String(item.category_level3 || ''),
              brand: String(item.brand || 'Unknown Brand'),
              status: validStatus,
              created_at: String(item.created_at || new Date().toISOString()),
              updated_at: item.updated_at ? String(item.updated_at) : undefined,
              stock_quantity: item.stock_quantity ? Number(item.stock_quantity) : 0,
              sku: String(item.sku || 'No SKU'),
              barcode: item.barcode ? String(item.barcode) : undefined,
              images: Array.isArray(item.images) ? item.images : [],
              color_blocks: Array.isArray(item.color_blocks) ? item.color_blocks : [],
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
  };

  const handleAddProduct = () => {
    router.push('/admin/products/add');
  };

  const handleEditProduct = (productId: number) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/admin/products/view/${productId}`);
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
    apiService.logout();
    router.push('/admin/signin');
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
    switch (category) {
      case 'clothing': return 'bg-blue-100 text-blue-800';
      case 'electronics': return 'bg-green-100 text-green-800';
      case 'home': return 'bg-yellow-100 text-yellow-800';
      case 'sports': return 'bg-purple-100 text-purple-800';
      case 'beauty': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total stock quantity from color blocks
  const getTotalStock = (product: Product) => {
    if (!product) return 0;
    
    if (product.stock_quantity !== undefined) {
      return product.stock_quantity;
    }
    
    if (product.color_blocks && Array.isArray(product.color_blocks)) {
      return product.color_blocks.reduce((total, block) => {
        if (!block || !Array.isArray(block.sizes)) return total;
        return total + block.sizes.reduce((blockTotal, size) => {
          return blockTotal + parseInt(size.quantity || '0');
        }, 0);
      }, 0);
    }
    
    return 0;
  };

  // Get colors from color blocks
  const getProductColors = (product: Product) => {
    if (!product || !product.color_blocks || !Array.isArray(product.color_blocks)) {
      return [];
    }
    
    return product.color_blocks
      .filter(block => block && (block.color || block.new_color))
      .map(block => block.color || block.new_color)
      .filter(Boolean);
  };

  // Get sizes from color blocks
  const getProductSizes = (product: Product) => {
    if (!product || !product.color_blocks || !Array.isArray(product.color_blocks)) {
      return [];
    }
    
    const sizes = new Set<string>();
    product.color_blocks.forEach(block => {
      if (block && Array.isArray(block.sizes)) {
        block.sizes.forEach(size => {
          if (size && size.size) sizes.add(size.size);
        });
      }
    });
    return Array.from(sizes);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-56 bg-blue-200 border-r border-blue-300">
        <div className="p-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">TAD</h2>
          <nav className="space-y-1">
            <a href="/admin/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </a>
            <a href="/admin/brands" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Tag className="h-4 w-4" />
              <span>Brands</span>
            </a>
            <a href="/admin/products" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-md text-sm">
              <Box className="h-4 w-4" />
              <span className="font-medium">Products</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Clipboard className="h-4 w-4" />
              <span>Orders</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Truck className="h-4 w-4" />
              <span>Logistics</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Megaphone className="h-4 w-4" />
              <span>Marketing & Promotions</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Mail className="h-4 w-4" />
              <span>Support inbox</span>
            </a>
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
                      <Badge variant="outline" className={`${getCategoryColor(product.category || '')} text-xs`}>
                        {(product.category || 'Unknown').charAt(0).toUpperCase() + (product.category || 'Unknown').slice(1)}
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.brand || 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold text-green-600">${product.price}</p>
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
                        <span className="text-gray-600">{product.sku || 'No SKU'}</span>
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
    </div>
  );
} 