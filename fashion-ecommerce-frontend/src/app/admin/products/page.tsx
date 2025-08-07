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
  Image, Palette, Ruler, Hash
} from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  category: string;
  brand: string;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  created_at: string;
  stock_quantity: number;
  sku: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  rating?: number;
  review_count?: number;
  total_sold?: number;
  revenue?: number;
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
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock stats data (replace with actual API call)
  const [stats] = useState<Stats>({
    totalProducts: 156,
    activeProducts: 142,
    outOfStock: 8,
    categories: 12,
    totalRevenue: 285000
  });

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, brandFilter, priceFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Premium Cotton T-Shirt",
          description: "High-quality cotton t-shirt with modern fit",
          price: 29.99,
          sale_price: 24.99,
          category: "clothing",
          brand: "Fashion Forward",
          status: "active",
          created_at: "2024-01-15T10:30:00Z",
          stock_quantity: 45,
          sku: "FF-CT-001",
          images: ["https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=T"],
          colors: ["Blue", "Black", "White"],
          sizes: ["S", "M", "L", "XL"],
          tags: ["cotton", "casual", "comfortable"],
          rating: 4.5,
          review_count: 23,
          total_sold: 156,
          revenue: 3894
        },
        {
          id: 2,
          name: "Wireless Bluetooth Headphones",
          description: "Premium sound quality with noise cancellation",
          price: 89.99,
          category: "electronics",
          brand: "TechGear Pro",
          status: "active",
          created_at: "2024-02-20T09:15:00Z",
          stock_quantity: 32,
          sku: "TG-WH-002",
          images: ["https://via.placeholder.com/150x150/10B981/FFFFFF?text=H"],
          colors: ["Black", "White"],
          sizes: ["One Size"],
          tags: ["wireless", "bluetooth", "noise-cancelling"],
          rating: 4.8,
          review_count: 67,
          total_sold: 89,
          revenue: 8009
        },
        {
          id: 3,
          name: "Garden Tool Set",
          description: "Complete set of essential gardening tools",
          price: 49.99,
          category: "home",
          brand: "Home & Garden Co",
          status: "out_of_stock",
          created_at: "2024-04-10T11:20:00Z",
          stock_quantity: 0,
          sku: "HG-GT-003",
          images: ["https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=G"],
          colors: ["Green", "Brown"],
          sizes: ["Standard"],
          tags: ["garden", "tools", "outdoor"],
          rating: 4.2,
          review_count: 12,
          total_sold: 34,
          revenue: 1699
        },
        {
          id: 4,
          name: "Professional Basketball",
          description: "Official size and weight basketball",
          price: 34.99,
          category: "sports",
          brand: "Sports Elite",
          status: "active",
          created_at: "2024-03-05T14:45:00Z",
          stock_quantity: 28,
          sku: "SE-BB-004",
          images: ["https://via.placeholder.com/150x150/EF4444/FFFFFF?text=B"],
          colors: ["Orange", "Brown"],
          sizes: ["Size 7"],
          tags: ["basketball", "sports", "professional"],
          rating: 4.6,
          review_count: 45,
          total_sold: 78,
          revenue: 2729
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
      });

      setProducts(filteredProducts);
      setTotalPages(Math.ceil(filteredProducts.length / 12));
    } catch (error) {
      console.error('Error loading products:', error);
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
        console.log('Deleting product:', productId);
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleLogout = () => {
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
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
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

                  <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="clothing">Clothing & Apparel</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports & Outdoor</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand-filter">Brand</Label>
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        <SelectItem value="Fashion Forward">Fashion Forward</SelectItem>
                        <SelectItem value="TechGear Pro">TechGear Pro</SelectItem>
                        <SelectItem value="Home & Garden Co">Home & Garden Co</SelectItem>
                        <SelectItem value="Sports Elite">Sports Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price-filter">Price Range</Label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
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
              </Card>
            )}
          </div>

          {/* Enhanced Product Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first product</p>
              <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-6 h-6 rounded" />
                          ) : (
                            <Image className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{product.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {product.description}
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
                      <Badge variant="outline" className={`${getCategoryColor(product.category)} text-xs`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.brand}</p>
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
                        <p className={`text-sm font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock_quantity}
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
                        <span className="text-gray-600">{product.sku}</span>
                      </div>
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Palette className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{product.colors.length} colors</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
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