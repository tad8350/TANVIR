"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Home, Tag, Box, Clipboard, CreditCard, Truck, 
  BarChart3, Settings, Mail, Bell, AlertTriangle, 
  X, CheckCircle, ChevronRight, Settings as SettingsIcon,
  Megaphone, Plus, Cog, MessageSquare, User, LogOut, ChevronDown,
  Clock, Plus as PlusIcon, DollarSign, Tag as TagIcon, Search,
  Filter, MoreHorizontal, Edit, Trash2, Eye, Shield, Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminLogout, requireAdminAuth } from "@/lib/admin-auth";

// User interface based on your backend entities
interface User {
  id: number;
  email: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
  customerProfile?: {
    first_name: string;
    last_name: string;
  };
  brandProfile?: {
    brand_name: string;
    business_name: string;
  };
  adminProfile?: {
    first_name: string;
    last_name: string;
  };
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    requireAdminAuth(router);
  }, [router]);

  // Fetch users when role filter changes
  useEffect(() => {
    if (roleFilter !== "All") {
      fetchUsersByRole(roleFilter);
    } else {
      fetchAllUsers();
    }
  }, [roleFilter]);

  // Filter users based on search and status
  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.customerProfile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.customerProfile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.brandProfile?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.brandProfile?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.adminProfile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.adminProfile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesStatus = statusFilter === "All" || 
        (statusFilter === "Active" && user.is_active) ||
        (statusFilter === "Inactive" && !user.is_active);
      
      return matchesSearch && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get token from cookies
      const token = getAdminToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get token from cookies
      const token = getAdminToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Map frontend role names to backend user_type values
      const roleMapping: { [key: string]: string } = {
        'Customer': 'customer',
        'Brand': 'brand',
        'Admin': 'admin'
      };
      
      const backendRole = roleMapping[role];
      if (!backendRole) {
        setUsers([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      // Filter users by role on the frontend since backend doesn't have role filtering
      const filteredUsers = data.data?.filter((user: User) => user.user_type === backendRole) || [];
      setUsers(filteredUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

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
    adminLogout(router);
  };

  // Helper function to get admin token from cookies
  const getAdminToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const getUserDisplayName = (user: User) => {
    if (user.user_type === 'customer' && user.customerProfile) {
      return `${user.customerProfile.first_name || ''} ${user.customerProfile.last_name || ''}`.trim() || 'N/A';
    } else if (user.user_type === 'brand' && user.brandProfile) {
      return user.brandProfile.brand_name || user.brandProfile.business_name || 'N/A';
    } else if (user.user_type === 'admin' && user.adminProfile) {
      return `${user.adminProfile.first_name || ''} ${user.adminProfile.last_name || ''}`.trim() || 'N/A';
    }
    return 'N/A';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getRoleColor = (userType: string) => {
    switch (userType) {
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "brand":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <a href="/admin/users" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-md text-sm">
              <Users className="h-4 w-4" />
              <span className="font-medium">Users</span>
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
              <h1 className="text-xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 text-xs">Manage and monitor user accounts</p>
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

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.is_active).length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brands</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.user_type === 'brand').length}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => new Date(u.created_at) > new Date('2024-04-01')).length}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white shadow-sm border-0 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
                    >
                      <option value="All">All Roles</option>
                      <option value="Customer">Customer</option>
                      <option value="Brand">Brand</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">User Accounts</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 mb-2">Error loading users</p>
                  <p className="text-gray-500 text-sm">{error}</p>
                  <Button 
                    onClick={() => roleFilter !== "All" ? fetchUsersByRole(roleFilter) : fetchAllUsers()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Join Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Verified</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{getUserDisplayName(user)}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.user_type)}`}>
                                {user.user_type === 'customer' ? 'Customer' : 
                                 user.user_type === 'brand' ? 'Brand' : 
                                 user.user_type === 'admin' ? 'Admin' : user.user_type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.is_active)}`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{user.last_login ? formatDateTime(user.last_login) : 'Never'}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.is_verified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Eye className="h-4 w-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Edit className="h-4 w-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found matching your criteria</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
