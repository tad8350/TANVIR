"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, ShoppingBag, Package, TrendingUp, ArrowRight, 
  Home, Tag, Box, Clipboard, CreditCard, Truck, 
  BarChart3, Settings, Mail, Bell, AlertTriangle, 
  X, CheckCircle, ChevronRight, Settings as SettingsIcon,
  Megaphone, Plus, Cog, MessageSquare, User, LogOut, ChevronDown,
  Clock, Plus as PlusIcon, DollarSign, Tag as TagIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import SalesChart from "@/components/SalesChart";

export default function AdminDashboard() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
    ordersToday: 0
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animated counters
  useEffect(() => {
    const targetCounts = {
      users: 1234,
      orders: 567,
      products: 890,
      revenue: 45231,
      ordersToday: 12
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounts = () => {
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounts({
          users: Math.floor(targetCounts.users * progress),
          orders: Math.floor(targetCounts.orders * progress),
          products: Math.floor(targetCounts.products * progress),
          revenue: Math.floor(targetCounts.revenue * progress),
          ordersToday: Math.floor(targetCounts.ordersToday * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounts(targetCounts);
        }
      }, stepDuration);
    };

    animateCounts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.push('/admin/signin');
  };

  const handleAddBrand = () => {
    console.log('Add Brand button clicked');
    console.log('Router:', router);
    console.log('Attempting to navigate to /admin/brands/add');
    router.push('/admin/brands/add');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-56 bg-blue-200 border-r border-blue-300">
        <div className="p-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">TAD</h2>
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-md text-sm">
              <Home className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </a>
            <a href="/admin/brands" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
              <Tag className="h-4 w-4" />
              <span>Brands</span>
            </a>
            <a href="/admin/products" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm">
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Hi, Tanvir (Admin)</h1>
              <p className="text-gray-600 text-xs">Here's a quick overview of what's happening today</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Tuesday, April 23, 2024</p>
                <p className="text-xs text-gray-500">11:45 AM</p>
              </div>
              {/* User Avatar Dropdown */}
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Tanvir</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <a href="#" className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
                      <User className="h-3 w-3" />
                      <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
                      <Settings className="h-3 w-3" />
                      <span>Settings</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group" title="Total number of registered users on the platform">
                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{counts.users.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-1">Total Users</div>
                      <div className="text-xs text-green-600 mt-1">+20.1% from last month</div>
                    </div>
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group" title="Total number of orders placed by customers">
                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{counts.orders.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-1">Total Orders</div>
                      <div className="text-xs text-green-600 mt-1">+15.3% from last month</div>
                    </div>
                    <ShoppingBag className="h-5 w-5 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group" title="Total number of products available in inventory">
                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{counts.products.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-1">Total Products</div>
                      <div className="text-xs text-green-600 mt-1">+8.2% from last month</div>
                    </div>
                    <Package className="h-5 w-5 text-purple-400" />
                  </div>
              </CardContent>
            </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group" title="Total revenue generated from all sales">
                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">${counts.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-1">Revenue</div>
                      <div className="text-xs text-green-600 mt-1">+12.5% from last month</div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                  </div>
              </CardContent>
            </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group" title="Number of orders received today">
                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{counts.ordersToday}</div>
                      <div className="text-xs text-gray-600 mt-1">Orders Today</div>
                      <div className="text-xs text-green-600 mt-1">+5.2% from yesterday</div>
                    </div>
                    <Clipboard className="h-5 w-5 text-orange-400" />
                  </div>
              </CardContent>
            </Card>
            </div>

            {/* Sales Chart */}
            <Card className="mb-6 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 p-3">
                  <SalesChart />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group" title="Add new brand partner accounts">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Add Brand</CardTitle>
                    <CardDescription className="text-xs">Add new brand partner accounts</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                      onClick={() => router.push('/admin/brands/add')}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Brand
                    </Button>
                </CardContent>
              </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group" title="Add new products to inventory">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Add Product</CardTitle>
                    <CardDescription className="text-xs">Add new products to inventory</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                      onClick={() => router.push('/admin/products/add')}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Product
                    </Button>
                </CardContent>
              </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group" title="Configure homepage banners">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Configure Banners</CardTitle>
                    <CardDescription className="text-xs">Configure homepage banners</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm">
                      <Cog className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                </CardContent>
              </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group" title="Send notifications to users">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Send Notification</CardTitle>
                    <CardDescription className="text-xs">Send notifications to users</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Send Notification
                    </Button>
                </CardContent>
              </Card>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Notifications */}
          <div className="w-72 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Notifications</h3>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex space-x-1 mb-3">
              <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                All
              </button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                Orders
              </button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                Products
              </button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                Returns
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 group">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">5 products need approval</p>
                  <p className="text-xs text-gray-500">15 min ago</p>
                  <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 group">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">Order #1272 return rejected by courier</p>
                  <p className="text-xs text-gray-500">1h ago</p>
                  <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 group">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">Refund issued to Order #1223</p>
                  <p className="text-xs text-gray-500">2h ago</p>
                  <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group">
                <Bell className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">New order #1275 received</p>
                  <p className="text-xs text-gray-500">5 min ago</p>
                  <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 group">
                <Package className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">Product "Nike Air Max" stock low</p>
                  <p className="text-xs text-gray-500">30 min ago</p>
                  <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-900 mb-2">System Notifications</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded transition-colors duration-200 group">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-700">Aldda email</span>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-500">1h ago</span>
                    <ChevronRight className="h-2.5 w-2.5 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded transition-colors duration-200 group">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-700">Confirm accounting</span>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-500">3h ago</span>
                    <ChevronRight className="h-2.5 w-2.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-900 mb-2">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">You added a new brand "Nike"</p>
                    <p className="text-xs text-gray-500">2h ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">Order #1234 refunded</p>
                    <p className="text-xs text-gray-500">1h ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 bg-purple-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">New product "Air Max 90" added</p>
                    <p className="text-xs text-gray-500">45 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">Payment received for Order #1275</p>
                    <p className="text-xs text-gray-500">30 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">User "john.doe@email.com" registered</p>
                    <p className="text-xs text-gray-500">15 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 bg-indigo-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">Inventory updated for "Adidas Ultraboost"</p>
                    <p className="text-xs text-gray-500">5 min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 