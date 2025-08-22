"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Settings,
  LogOut,
  Plus,
  Eye,
  BarChart3,
  FileText,
  CreditCard,
  MessageSquare,
  Bell,
  User,
  Globe,
  Truck,
  Shield,
  Palette,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [brandData, setBrandData] = useState<BrandData | null>(null);

  // Get brand data from cookies on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const brandDataCookie = cookies.find(cookie => cookie.trim().startsWith('brand_data='));
      if (brandDataCookie) {
        try {
          const data = JSON.parse(decodeURIComponent(brandDataCookie.split('=')[1]));
          setBrandData(data);
        } catch (error) {
          console.error('Error parsing brand data:', error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'brand_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'brand_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/brand/signin');
  };

  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/brand/dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Overview and analytics"
    },
    {
      title: "Products",
      href: "/brand/products",
      icon: <Package className="w-5 h-5" />,
      description: "Manage your catalog",
      badge: "24"
    },
    {
      title: "Orders",
      href: "/brand/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
      description: "View and manage orders",
      badge: "12"
    },
    {
      title: "Customers",
      href: "/brand/customers",
      icon: <Users className="w-5 h-5" />,
      description: "Customer database"
    },
    {
      title: "Analytics",
      href: "/brand/analytics",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Performance reports"
    },
    {
      title: "Finances",
      href: "/brand/finances",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Commissions & payments"
    },
    {
      title: "Support",
      href: "/brand/support",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Customer support tickets"
    },
    {
      title: "Brand Profile",
      href: "/brand/profile",
      icon: <Building2 className="w-5 h-5" />,
      description: "Company information"
    },
    {
      title: "Settings",
      href: "/brand/settings",
      icon: <Settings className="w-5 h-5" />,
      description: "Account configuration"
    }
  ];

  const quickActions = [
    {
      title: "Add Product",
      href: "/brand/products/add",
      icon: <Plus className="w-4 h-4" />,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View Orders",
      href: "/brand/orders",
      icon: <Eye className="w-4 h-4" />,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Analytics",
      href: "/brand/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {brandData?.brand_name || "Brand Portal"}
                </h1>
                <p className="text-xs text-gray-500 truncate">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="relative">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    isSidebarCollapsed ? "px-2" : "px-3"
                  } ${isActive ? "bg-purple-600 text-white" : "hover:bg-gray-100"}`}
                  onClick={() => router.push(item.href)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    {item.icon}
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Button>
                {!isSidebarCollapsed && isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-purple-600 rounded-r-full" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start ${action.color} text-white border-0`}
                  onClick={() => router.push(action.href)}
                >
                  {action.icon}
                  <span className="ml-2">{action.title}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="absolute bottom-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 p-0"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.href === pathname)?.title || "Dashboard"}
              </h2>
              {brandData?.is_verified && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
