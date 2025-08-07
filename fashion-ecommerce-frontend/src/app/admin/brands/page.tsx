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
  Star, TrendingDown, Users as UsersIcon, ShoppingCart
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchBrands } from "@/lib/api";

interface Brand {
  id: number;
  brand_name: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  phone_number?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: string;
  category?: string;
  commission_rate?: number;
  total_products?: number;
  revenue?: number;
  logo_url?: string;
  last_activity?: string;
}

interface Stats {
  totalBrands: number;
  activeBrands: number;
  pendingApprovals: number;
  newThisMonth: number;
  totalRevenue: number;
}

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock stats data (replace with actual API call)
  const [stats] = useState<Stats>({
    totalBrands: 24,
    activeBrands: 18,
    pendingApprovals: 3,
    newThisMonth: 5,
    totalRevenue: 125000
  });

  useEffect(() => {
    loadBrands();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, dateFilter]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockBrands: Brand[] = [
        {
          id: 1,
          brand_name: "Fashion Forward",
          description: "Premium fashion brand specializing in contemporary clothing",
          website_url: "https://fashionforward.com",
          contact_email: "contact@fashionforward.com",
          phone_number: "+1 (555) 123-4567",
          status: "active",
          created_at: "2024-01-15T10:30:00Z",
          category: "fashion",
          commission_rate: 15,
          total_products: 45,
          revenue: 25000,
          logo_url: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=FF",
          last_activity: "2024-04-22T14:30:00Z"
        },
        {
          id: 2,
          brand_name: "TechGear Pro",
          description: "High-quality electronics and gadgets",
          website_url: "https://techgearpro.com",
          contact_email: "hello@techgearpro.com",
          phone_number: "+1 (555) 987-6543",
          status: "active",
          created_at: "2024-02-20T09:15:00Z",
          category: "electronics",
          commission_rate: 12,
          total_products: 32,
          revenue: 18000,
          logo_url: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=TG",
          last_activity: "2024-04-21T16:45:00Z"
        },
        {
          id: 3,
          brand_name: "Home & Garden Co",
          description: "Everything for your home and garden needs",
          website_url: "https://homegardenco.com",
          contact_email: "info@homegardenco.com",
          phone_number: "+1 (555) 456-7890",
          status: "pending",
          created_at: "2024-04-10T11:20:00Z",
          category: "home",
          commission_rate: 10,
          total_products: 28,
          revenue: 8500,
          logo_url: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=HG",
          last_activity: "2024-04-20T10:15:00Z"
        },
        {
          id: 4,
          brand_name: "Sports Elite",
          description: "Professional sports equipment and accessories",
          website_url: "https://sportselite.com",
          contact_email: "team@sportselite.com",
          phone_number: "+1 (555) 321-0987",
          status: "suspended",
          created_at: "2024-03-05T14:45:00Z",
          category: "sports",
          commission_rate: 18,
          total_products: 67,
          revenue: 42000,
          logo_url: "https://via.placeholder.com/60x60/EF4444/FFFFFF?text=SE",
          last_activity: "2024-04-15T12:30:00Z"
        }
      ];

      // Apply filters
      let filteredBrands = mockBrands.filter(brand => {
        const matchesSearch = brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            brand.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || brand.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || brand.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
      });

      setBrands(filteredBrands);
      setTotalPages(Math.ceil(filteredBrands.length / 10));
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => {
    router.push('/admin/brands/add');
  };

  const handleEditBrand = (brandId: number) => {
    router.push(`/admin/brands/edit/${brandId}`);
  };

  const handleViewBrand = (brandId: number) => {
    router.push(`/admin/brands/view/${brandId}`);
  };

  const handleDeleteBrand = async (brandId: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        console.log('Deleting brand:', brandId);
        await loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <X className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      default: return <X className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fashion': return 'bg-blue-100 text-blue-800';
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
            <a href="/admin/brands" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-md text-sm">
              <Tag className="h-4 w-4" />
              <span className="font-medium">Brands</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Box className="h-4 w-4" />
              <span>Products</span>
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
                <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
                <p className="text-gray-600">Manage brand partner accounts</p>
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
                    <p className="text-sm text-gray-600">Total Brands</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBrands}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Brands</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeBrands}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
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

          {/* Search, Filters and Add Brand Section */}
          <div className="mb-6 space-y-4">
            {/* Search and Add Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search brands..."
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
                  onClick={handleAddBrand}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Brand
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
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
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports & Outdoor</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-filter">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Enhanced Brand Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first brand partner</p>
              <Button onClick={handleAddBrand} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Brand
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brand.brand_name} className="w-6 h-6 rounded" />
                          ) : (
                            <Building className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{brand.brand_name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {brand.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(brand.status)}
                        <Badge className={`${getStatusColor(brand.status)} text-xs`}>
                          {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Category and Commission */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`${getCategoryColor(brand.category || 'other')} text-xs`}>
                        {brand.category ? brand.category.charAt(0).toUpperCase() + brand.category.slice(1) : 'Other'}
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Commission</p>
                        <p className="text-sm font-semibold text-green-600">{brand.commission_rate || 0}%</p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{brand.total_products || 0}</p>
                        <p className="text-xs text-gray-500">Products</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">${(brand.revenue || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">
                          {brand.last_activity ? new Date(brand.last_activity).getDate() : '-'}
                        </p>
                        <p className="text-xs text-gray-500">Last Active</p>
                      </div>
                    </div>

                    {/* Contact Info - Compact */}
                    <div className="space-y-1">
                      {brand.contact_email && (
                        <div className="flex items-center space-x-1 text-xs">
                          <MailIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 truncate">{brand.contact_email}</span>
                        </div>
                      )}
                      {brand.phone_number && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 truncate">{brand.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {new Date(brand.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBrand(brand.id)}
                          className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBrand(brand.id)}
                          className="text-gray-600 hover:text-gray-700 h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBrand(brand.id)}
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