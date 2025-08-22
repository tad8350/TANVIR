"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Plus,
  Eye,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  Clock,
  Star,
  Building2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BrandData {
  id: number;
  brand_name: string;
  business_name: string;
  contact_email: string;
  logo_url?: string;
  banner_url?: string;
  category: string;
  is_verified: boolean;
}

export default function BrandDashboard() {
  const router = useRouter();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get brand data from cookies
    const getBrandToken = () => {
      if (typeof document === 'undefined') return null;
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('brand_token='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    };

    const getBrandData = () => {
      if (typeof document === 'undefined') return null;
      const cookies = document.cookie.split(';');
      const brandDataCookie = cookies.find(cookie => cookie.trim().startsWith('brand_data='));
      if (brandDataCookie) {
        try {
          return JSON.parse(decodeURIComponent(brandDataCookie.split('=')[1]));
        } catch (error) {
          console.error('Error parsing brand data:', error);
          return null;
        }
      }
      return null;
    };

    const token = getBrandToken();
    if (!token) {
      router.push('/brand/signin');
      return;
    }

    // Try to get brand data from cookies first
    const cookieBrandData = getBrandData();
    if (cookieBrandData) {
      setBrandData(cookieBrandData);
      setIsLoading(false);
    } else {
      // Fallback to mock data for now
      setBrandData({
        id: 1,
        brand_name: "Sample Brand",
        business_name: "Sample Business Ltd",
        contact_email: "brand@example.com",
        category: "Fashion & Apparel",
        is_verified: true
      });
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {brandData?.brand_name}!</h1>
        <p className="text-gray-600 text-lg">Here's what's happening with your business today.</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">24</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +2 from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +5 from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$2,450</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +20% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">156</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12 from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-green-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Add New Product</CardTitle>
            <CardDescription>Create and list new products in your catalog</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-blue-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">View Orders</CardTitle>
            <CardDescription>Check and manage customer orders</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-purple-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>View detailed performance reports</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity & Brand Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p className="font-semibold text-gray-900">Order #12345</p>
                  <p className="text-sm text-gray-600">2 items • $89.99</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Processing
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div>
                  <p className="font-semibold text-gray-900">Order #12344</p>
                  <p className="text-sm text-gray-600">1 item • $45.00</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Shipped
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">Order #12343</p>
                  <p className="text-sm text-gray-600">3 items • $129.99</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Delivered
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Brand Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              <span>Brand Information</span>
            </CardTitle>
            <CardDescription>Your brand details and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Brand Name:</span>
                <span className="font-semibold text-gray-900">{brandData?.brand_name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Business Name:</span>
                <span className="font-semibold text-gray-900">{brandData?.business_name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Category:</span>
                <Badge variant="secondary">{brandData?.category}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{brandData?.contact_email}</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Status:</span>
                <Badge variant={brandData?.is_verified ? "default" : "secondary"}>
                  {brandData?.is_verified ? "Active" : "Pending"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Performance Summary</span>
          </CardTitle>
          <CardDescription>Key metrics and insights for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8.5%</div>
              <div className="text-sm text-gray-600 mt-1">Conversion Rate</div>
              <div className="text-xs text-green-600 mt-1">+1.2% from last month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$89.50</div>
              <div className="text-sm text-gray-600 mt-1">Average Order Value</div>
              <div className="text-xs text-green-600 mt-1">+$5.20 from last month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.2</div>
              <div className="text-sm text-gray-600 mt-1">Customer Rating</div>
              <div className="flex items-center justify-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
