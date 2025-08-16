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
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
import { adminLogout, requireAdminAuth } from "@/lib/admin-auth";

interface Brand {
  id: number;
  user_id?: number;
  brand_name: string;
  business_name?: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  phone_number?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: string;
  updated_at?: string;
  category?: string;
  commission_rate?: number;
  total_products?: number;
  revenue?: number;
  logo_url?: string;
  banner_url?: string;
  last_activity?: string;
  
  // Additional fields from comprehensive DTO
  address?: string;
  region?: string;
  district?: string;
  registration_number?: string;
  business_license?: string;
  tax_id?: string;
  tin_number?: string;
  trade_license?: string;
  vat_registration?: string;
  import_export_license?: string;
  payment_method?: string;
  payment_phone?: string;
  account_holder_name?: string;
  payment_email?: string;
  warehouse_location?: string;
  physical_shops?: string;
  return_policy?: string;
  warranty_policy?: string;
  minimum_order_quantity?: string;
  shipping_zones?: string;
  payment_terms?: string;
  commission_structure?: string;
  payment_schedule?: string;
  minimum_payout_amount?: string;
  tax_deduction_details?: string;
  owner_full_name?: string;
  owner_email?: string;
  owner_password?: string;
  owner_phone?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  api_keys?: string;
  webhook_urls?: string;
  integration_settings?: string;
  
  // Additional fields from API response
  contact_person?: string;
  phone?: string;
  website?: string;
  payment_methods?: any;
  shipping_methods?: any;
  is_verified?: boolean;
  bank_account?: any;
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
  const [debugMode, setDebugMode] = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

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

  // Check authentication on component mount
  useEffect(() => {
    requireAdminAuth(router);
  }, [router]);

  // Add focus event listener to refresh brands when returning to the page
  useEffect(() => {
    // Removed annoying focus and visibility change listeners
    // Brands will only load when page loads or filters change
  }, []);

  // Show initial load notification
  useEffect(() => {
    if (!loading && brands.length === 0) {
      toast.info('No brands found. Add your first brand to get started!');
    }
  }, [loading, brands.length]);



  const loadBrands = async () => {
    try {
      setLoading(true);
      
      // Prepare filters for API call
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (searchTerm) filters.search = searchTerm;
      if (dateFilter !== 'all') filters.dateRange = dateFilter;

      console.log('Fetching brands with filters:', filters);
      
      try {
        // Try the main brands endpoint first
        const response = await apiService.getBrands(currentPage, 10, searchTerm, filters);
        console.log('Raw API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response.data type:', typeof response?.data);
        console.log('Response.data structure:', response?.data);
        
        if (response && response.data) {
          const responseData = response.data as any;
          console.log('ResponseData type:', typeof responseData);
          console.log('ResponseData keys:', Object.keys(responseData || {}));
          console.log('ResponseData.data:', responseData.data);
          console.log('ResponseData.brands:', responseData.brands);
          
          let brandsList: any[] = [];
          
          // Handle different response structures
          if (Array.isArray(responseData)) {
            brandsList = responseData;
            console.log('Using responseData as array, length:', brandsList.length);
          } else if (responseData.brands && Array.isArray(responseData.brands)) {
            brandsList = responseData.brands;
            console.log('Using responseData.brands, length:', brandsList.length);
          } else if (responseData.data && Array.isArray(responseData.data)) {
            brandsList = responseData.data;
            console.log('Using responseData.data, length:', brandsList.length);
          } else {
            console.error('Unexpected API response structure:', responseData);
            toast.error('Invalid data format received from server');
            setBrands([]);
            return;
          }
          
          console.log('Final brandsList:', brandsList);
          console.log('First brand sample:', brandsList[0]);
          
          // Process brands data...
          await processBrandsData(brandsList, responseData);
          
        } else {
          console.error('No data in API response');
          toast.error('No data received from server');
          setBrands([]);
        }
        
      } catch (mainError) {
        console.error('Main brands endpoint failed:', mainError);
        
        // Fallback to simple brands list endpoint
        try {
          console.log('Trying fallback brands endpoint...');
          const fallbackResponse = await apiService.getBrandsList();
          console.log('Fallback response:', fallbackResponse);
          
          if (fallbackResponse && fallbackResponse.data) {
            // Convert simple brand names to brand objects
            const simpleBrands = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
            const convertedBrands = simpleBrands.map((brandName: string, index: number) => ({
              id: index + 1,
              brand_name: brandName,
              description: `Brand: ${brandName}`,
              status: 'active' as const,
              created_at: new Date().toISOString(),
              category: 'fashion',
              commission_rate: 10,
              total_products: 0,
              revenue: 0
            }));
            
            await processBrandsData(convertedBrands, { total: convertedBrands.length });
            toast.info('Using fallback brands data. Some information may be limited.');
            
          } else {
            throw new Error('Fallback endpoint also failed');
          }
          
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
          throw mainError; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error loading brands:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load brands. Please try again.';
      let debugInfo = '';
      
      if (error instanceof Error) {
        debugInfo = error.message;
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Insufficient permissions.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('Internal server error')) {
          errorMessage = 'Backend server error. Please check backend logs.';
        }
      }
      
      console.error('Debug info:', debugInfo);
      toast.error(errorMessage);
      
      // Fallback to empty state
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const processBrandsData = async (brandsList: any[], responseData: any) => {
    // Validate and clean brands data
    const validBrands = brandsList
      .filter((item: any) => {
        // Must be an object with required fields
        if (!item || typeof item !== 'object') return false;
        if (!item.id || !item.brand_name) return false;
        
        // Ensure all required fields are strings/numbers, not objects
        if (typeof item.brand_name !== 'string') return false;
        if (typeof item.id !== 'number') return false;
        
        return true;
      })
      .map((item: any) => {
        // Clean and normalize the brand data - include ALL fields from backend
        return {
          id: Number(item.id) || 0,
          user_id: item.user_id ? Number(item.user_id) : undefined,
          brand_name: String(item.brand_name || 'Unnamed Brand'),
          business_name: item.business_name ? String(item.business_name) : undefined,
          description: String(item.description || ''),
          website_url: item.website_url ? String(item.website_url) : undefined,
          contact_email: item.contact_email ? String(item.contact_email) : undefined,
          phone_number: item.phone_number ? String(item.phone_number) : undefined,
          status: (String(item.status || 'active') as 'active' | 'inactive' | 'pending' | 'suspended'),
          created_at: String(item.created_at || new Date().toISOString()),
          updated_at: item.updated_at ? String(item.updated_at) : undefined,
          category: item.category ? String(item.category) : undefined,
          commission_rate: item.commission_rate ? Number(item.commission_rate) : 0,
          total_products: item.total_products ? Number(item.total_products) : 0,
          revenue: item.revenue ? Number(item.revenue) : 0,
          logo_url: item.logo_url ? String(item.logo_url) : undefined,
          banner_url: item.banner_url ? String(item.banner_url) : undefined,
          last_activity: item.last_activity ? String(item.last_activity) : undefined,
          
          // Comprehensive fields from backend
          address: item.address ? String(item.address) : undefined,
          region: item.region ? String(item.region) : undefined,
          district: item.district ? String(item.district) : undefined,
          registration_number: item.registration_number ? String(item.registration_number) : undefined,
          business_license: item.business_license ? String(item.business_license) : undefined,
          tax_id: item.tax_id ? String(item.tax_id) : undefined,
          tin_number: item.tin_number ? String(item.tin_number) : undefined,
          trade_license: item.trade_license ? String(item.trade_license) : undefined,
          vat_registration: item.vat_registration ? String(item.vat_registration) : undefined,
          import_export_license: item.import_export_license ? String(item.import_export_license) : undefined,
          payment_method: item.payment_method ? String(item.payment_method) : undefined,
          payment_phone: item.payment_phone ? String(item.payment_phone) : undefined,
          account_holder_name: item.account_holder_name ? String(item.account_holder_name) : undefined,
          payment_email: item.payment_email ? String(item.payment_email) : undefined,
          warehouse_location: item.warehouse_location ? String(item.warehouse_location) : undefined,
          physical_shops: item.physical_shops ? String(item.physical_shops) : undefined,
          return_policy: item.return_policy ? String(item.return_policy) : undefined,
          warranty_policy: item.warranty_policy ? String(item.warranty_policy) : undefined,
          minimum_order_quantity: item.minimum_order_quantity ? String(item.minimum_order_quantity) : undefined,
          shipping_zones: item.shipping_zones ? String(item.shipping_zones) : undefined,
          payment_terms: item.payment_terms ? String(item.payment_terms) : undefined,
          commission_structure: item.commission_structure ? String(item.commission_structure) : undefined,
          payment_schedule: item.payment_schedule ? String(item.payment_schedule) : undefined,
          minimum_payout_amount: item.minimum_payout_amount ? String(item.minimum_payout_amount) : undefined,
          tax_deduction_details: item.tax_deduction_details ? String(item.tax_deduction_details) : undefined,
          owner_full_name: item.owner_full_name ? String(item.owner_full_name) : undefined,
          owner_email: item.owner_email ? String(item.owner_email) : undefined,
          owner_password: item.owner_password ? String(item.owner_password) : undefined,
          owner_phone: item.owner_phone ? String(item.owner_phone) : undefined,
          facebook_url: item.facebook_url ? String(item.facebook_url) : undefined,
          instagram_url: item.instagram_url ? String(item.instagram_url) : undefined,
          twitter_url: item.twitter_url ? String(item.twitter_url) : undefined,
          linkedin_url: item.linkedin_url ? String(item.linkedin_url) : undefined,
          api_keys: item.api_keys ? String(item.api_keys) : undefined,
          webhook_urls: item.webhook_urls ? String(item.webhook_urls) : undefined,
          integration_settings: item.integration_settings ? String(item.integration_settings) : undefined,
          
          // Additional fields from API response
          contact_person: item.contact_person ? String(item.contact_person) : undefined,
          phone: item.phone ? String(item.phone) : undefined,
          website: item.website ? String(item.website) : undefined,
          payment_methods: item.payment_methods || {},
          shipping_methods: item.shipping_methods || {},
          is_verified: item.is_verified === true,
          bank_account: item.bank_account || {}
        } as Brand;
      });
    
    console.log('Valid brands after cleaning:', validBrands.length);
    console.log('Sample brand with all fields:', validBrands[0]);
    
    setBrands(validBrands);
    
    // Show success message if brands were loaded
    if (validBrands.length > 0) {
      toast.success(`Loaded ${validBrands.length} brands successfully`);
    } else {
      toast.info('No brands found. Add your first brand to get started!');
    }
    
    // Calculate total pages
    const total = responseData.total || responseData.totalPages || validBrands.length || 0;
    setTotalPages(Math.ceil(total / 10));
  };

  const handleAddBrand = () => {
    router.push('/admin/brands/add');
  };

  const handleEditBrand = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      setSelectedBrand(brand);
      setEditModalOpen(true);
    }
  };

  const handleSaveBrand = async () => {
    if (!selectedBrand) return;
    
    try {
      // Helper function to safely get form values
      const getFormValue = (id: string, defaultValue: any = '') => {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Form element with id '${id}' not found`);
          return defaultValue;
        }
        
        if (element instanceof HTMLInputElement) {
          if (element.type === 'number') {
            const value = parseFloat(element.value);
            return isNaN(value) ? defaultValue : value;
          }
          return element.value || defaultValue;
        } else if (element instanceof HTMLTextAreaElement) {
          return element.value || defaultValue;
        } else if (element instanceof HTMLSelectElement) {
          return element.value || defaultValue;
        }
        
        return defaultValue;
      };

      // Collect all form values from the edit modal with proper type conversion
      const formData: Partial<Brand> = {
        brand_name: getFormValue('edit-brand-name', selectedBrand.brand_name),
        business_name: getFormValue('edit-business-name', ''),
        description: getFormValue('edit-description', ''),
        category: getFormValue('edit-category', 'fashion'),
        // Removed 'status' as backend doesn't allow it to be updated
        contact_email: getFormValue('edit-contact-email', ''),
        phone_number: getFormValue('edit-phone', ''),
        address: getFormValue('edit-address', ''),
        region: getFormValue('edit-region', ''),
        district: getFormValue('edit-district', ''),
        website_url: getFormValue('edit-website', ''),
        contact_person: getFormValue('edit-contact-person', ''),
        phone: getFormValue('edit-phone-alt', ''),
        registration_number: getFormValue('edit-registration', ''),
        business_license: getFormValue('edit-business-license', ''),
        tax_id: getFormValue('edit-tax-id', ''),
        tin_number: getFormValue('edit-tin', ''),
        trade_license: getFormValue('edit-trade-license', ''),
        vat_registration: getFormValue('edit-vat-registration', ''),
        import_export_license: getFormValue('edit-import-export', ''),
        payment_method: getFormValue('edit-payment-method', ''),
        payment_phone: getFormValue('edit-payment-phone', ''),
        account_holder_name: getFormValue('edit-account-holder', ''),
        payment_email: getFormValue('edit-payment-email', ''),
        warehouse_location: getFormValue('edit-warehouse', ''),
        physical_shops: getFormValue('edit-physical-shops', ''),
        return_policy: getFormValue('edit-return-policy', ''),
        warranty_policy: getFormValue('edit-warranty-policy', ''),
        minimum_order_quantity: getFormValue('edit-min-order', ''),
        shipping_zones: getFormValue('edit-shipping-zones', ''),
        payment_terms: getFormValue('edit-payment-terms', ''),
        commission_structure: getFormValue('edit-commission-structure', ''),
        payment_schedule: getFormValue('edit-payment-schedule', ''),
        minimum_payout_amount: getFormValue('edit-min-payout', ''),
        tax_deduction_details: getFormValue('edit-tax-deduction', ''),
        owner_full_name: getFormValue('edit-owner-name', ''),
        owner_email: getFormValue('edit-owner-email', ''),
        owner_password: getFormValue('edit-owner-password', ''),
        // Removed 'owner_phone' as backend doesn't allow it to be updated
        facebook_url: getFormValue('edit-facebook', ''),
        instagram_url: getFormValue('edit-instagram', ''),
        twitter_url: getFormValue('edit-twitter', ''),
        linkedin_url: getFormValue('edit-linkedin', ''),
        logo_url: getFormValue('edit-logo-url', ''),
        banner_url: getFormValue('edit-banner-url', ''),
        api_keys: getFormValue('edit-api-keys', ''),
        webhook_urls: getFormValue('edit-webhooks', ''),
        integration_settings: getFormValue('edit-integration', ''),
        commission_rate: getFormValue('edit-commission', selectedBrand.commission_rate || 0)
      };

      // Filter out empty values to avoid sending unnecessary data
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          if (value === '' || value === null || value === undefined) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        })
      );

      console.log('Original form data:', formData);
      console.log('Filtered form data to send:', filteredFormData);
      
      // Debug: Show specific field values
      console.log('=== FORM FIELD DEBUG ===');
      console.log('Commission Rate:', getFormValue('edit-commission-rate', 'NOT_FOUND'));
      console.log('Brand Name:', getFormValue('edit-brand-name', 'NOT_FOUND'));
      console.log('Description:', getFormValue('edit-description', 'NOT_FOUND'));
      console.log('Category:', getFormValue('edit-category', 'NOT_FOUND'));
      console.log('=== END FORM DEBUG ===');
      
      // Call API to update brand
      const response = await apiService.updateBrand(selectedBrand.id, filteredFormData);
      
      if (response) {
        toast.success('Brand updated successfully!');
        
        // Update the local brands array with the actual new values
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === selectedBrand.id 
              ? { ...brand, ...filteredFormData }
              : brand
          )
        );
        
        // Also update the selectedBrand state to reflect changes
        setSelectedBrand(prev => prev ? { ...prev, ...filteredFormData } : null);
        
        // Reload brands to ensure UI shows latest data
        await loadBrands();
        
        // Close the modal
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand. Please try again.');
    }
  };

  const handleViewBrand = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      setSelectedBrand(brand);
      setViewModalOpen(true);
      setCredentials(null); // Reset credentials
    }
  };

  const handleDeleteBrand = async (brandId: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await apiService.deleteBrand(brandId);
        toast.success('Brand deleted successfully.');
        loadBrands();
      } catch (error) {
        toast.error('Failed to delete brand.');
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleLogout = () => {
    adminLogout(router);
  };

  const handleFetchCredentials = async (brandId: number) => {
    console.log('=== FETCH CREDENTIALS DEBUG ===');
    console.log('Fetching credentials for brand ID:', brandId);
    
    setLoadingCredentials(true);
    try {
      // Call the backend API to get brand credentials
      const response = await apiService.getBrandCredentials(brandId);
      console.log('API response:', response);
      
      // Handle different response structures
      let credentialsData: any = null;
      
      if (response && response.data) {
        // If response has nested data property
        credentialsData = response.data;
      } else if (response && typeof response === 'object') {
        // If response is the credentials object directly
        credentialsData = response;
      }
      
      console.log('Credentials data to process:', credentialsData);
      
      if (credentialsData && 
          typeof credentialsData === 'object' && 
          typeof credentialsData.email === 'string' && 
          typeof credentialsData.password === 'string') {
        
        const credentials = {
          email: credentialsData.email,
          password: credentialsData.password
        };
        
        console.log('Setting credentials:', credentials);
        setCredentials(credentials);
        toast.success('Credentials retrieved successfully!');
        
      } else {
        console.error('Invalid credentials format:', credentialsData);
        console.log('CredentialsData keys:', Object.keys(credentialsData || {}));
        console.log('CredentialsData.email type:', typeof credentialsData?.email);
        console.log('CredentialsData.password type:', typeof credentialsData?.password);
        toast.error('Invalid credentials format received from server');
      }
      
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to fetch credentials');
    } finally {
      setLoadingCredentials(false);
    }
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

  const handleDebugBrandData = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      console.log('=== DEBUG: Brand Data for ID', brandId, '===');
      console.log('Full brand object:', brand);
      console.log('Key fields check:');
      console.log('- brand_name:', brand.brand_name);
      console.log('- business_name:', brand.business_name);
      console.log('- address:', brand.address);
      console.log('- region:', brand.region);
      console.log('- district:', brand.district);
      console.log('- registration_number:', brand.registration_number);
      console.log('- business_license:', brand.business_license);
      console.log('- tax_id:', brand.tax_id);
      console.log('- tin_number:', brand.tin_number);
      console.log('- payment_method:', brand.payment_method);
      console.log('- payment_phone:', brand.payment_phone);
      console.log('- account_holder_name:', brand.account_holder_name);
      console.log('- payment_terms:', brand.payment_terms);
      console.log('- payment_schedule:', brand.payment_schedule);
      console.log('- minimum_payout_amount:', brand.minimum_payout_amount);
      console.log('- owner_full_name:', brand.owner_full_name);
      console.log('- owner_email:', brand.owner_email);
      console.log('=== END DEBUG ===');
      
      // Show alert with key data
      const debugInfo = `
Brand ID: ${brand.id}
Brand Name: ${brand.brand_name}
Business Name: ${brand.business_name || 'NOT LOADED'}
Address: ${brand.address || 'NOT LOADED'}
Region: ${brand.region || 'NOT LOADED'}
District: ${brand.district || 'NOT LOADED'}
Registration: ${brand.registration_number || 'NOT LOADED'}
Payment Method: ${brand.payment_method || 'NOT LOADED'}
Owner: ${brand.owner_full_name || 'NOT LOADED'}
      `;
      alert(debugInfo);
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
                  variant="outline"
                  onClick={loadBrands}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <div className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span>{loading ? 'Loading...' : 'Refresh Brands'}</span>
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
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-10">
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

                  <div className="space-y-2">
                    <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="h-10">
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
                
                {/* Clear Filters Button */}
                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setDateFilter('all');
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

            {/* Debug Information */}
            {debugMode && (
              <Card className="mb-6 bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-yellow-700 space-y-2">
                  <div><strong>Brands Count:</strong> {brands.length}</div>
                  <div><strong>Loading State:</strong> {loading ? 'Yes' : 'No'}</div>
                  <div><strong>Current Page:</strong> {currentPage}</div>
                  <div><strong>Total Pages:</strong> {totalPages}</div>
                  <div><strong>Search Term:</strong> {searchTerm || 'None'}</div>
                  <div><strong>Status Filter:</strong> {statusFilter}</div>
                  <div><strong>Category Filter:</strong> {categoryFilter}</div>
                  <div><strong>Date Filter:</strong> {dateFilter}</div>
                  <div><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</div>
                  <div><strong>Brands Data:</strong> {JSON.stringify(brands.slice(0, 2), null, 2)}</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Brand Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading brands...</p>
              </div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
              <p className="text-gray-500 mb-4">
                {loading ? 'Loading brands...' : 'No brands match your current filters or the API is not available.'}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button onClick={loadBrands} variant="outline" className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
              <Button onClick={handleAddBrand} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Brand
              </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {brands.filter(brand => brand && brand.id && brand.brand_name).map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brand.brand_name || 'Brand'} className="w-6 h-6 rounded" />
                          ) : (
                            <Building className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{brand.brand_name || 'Unnamed Brand'}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {brand.description || 'No description available'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(brand.status)}
                        <Badge className={`${getStatusColor(brand.status)} text-xs`}>
                          {(brand.status || 'active').charAt(0).toUpperCase() + (brand.status || 'active').slice(1)}
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
                        {brand.created_at ? new Date(brand.created_at).toLocaleDateString() : 'Date unknown'}
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
                        {debugMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDebugBrandData(brand.id)}
                            className="text-yellow-600 hover:text-yellow-700 h-6 w-6 p-0"
                            title="Debug Brand Data"
                          >
                            <Cog className="h-3 w-3" />
                          </Button>
                        )}
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

      {/* View Brand Modal */}
      {viewModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Brand Details: {selectedBrand.brand_name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Brand Name</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.brand_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge className={getStatusColor(selectedBrand.status)}>
                      {selectedBrand.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.description || 'No description'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Website</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.website_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Commission Rate</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.commission_rate || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Contact Email</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.contact_email || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Address</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Region</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.region || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">District</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.district || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Registration Number</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.registration_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Business License</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.business_license || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tax ID</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.tax_id || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">TIN Number</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.tin_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Trade License</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.trade_license || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">VAT Registration</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.vat_registration || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Import/Export License</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.import_export_license || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.payment_method || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Phone</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.payment_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Holder</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.account_holder_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Email</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.payment_email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Operational Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Operational Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Warehouse Location</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.warehouse_location || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Physical Shops</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.physical_shops || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Return Policy</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.return_policy || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Warranty Policy</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.warranty_policy || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Minimum Order Quantity</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.minimum_order_quantity || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Shipping Zones</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.shipping_zones || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Partnership Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Partnership Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Commission Rate</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.commission_rate || 0}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Terms</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.payment_terms || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Schedule</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.payment_schedule || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Minimum Payout</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.minimum_payout_amount || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Brand Owner Account */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Brand Owner Account</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Owner Name</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.owner_full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Owner Email</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.owner_email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Facebook</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.facebook_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Instagram</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.instagram_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Twitter</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.twitter_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">LinkedIn</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.linkedin_url || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Brand Assets */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Brand Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Logo URL</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.logo_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Banner URL</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.banner_url || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Technical & Integration */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Technical & Integration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">API Keys</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.api_keys || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Webhook URLs</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.webhook_urls || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Integration Settings</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.integration_settings || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">System Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created Date</Label>
                    <p className="text-sm text-gray-900">
                      {selectedBrand.created_at ? new Date(selectedBrand.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Total Products</Label>
                    <p className="text-sm text-gray-900">{selectedBrand.total_products || 0}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Revenue</Label>
                    <p className="text-sm text-gray-900">${(selectedBrand.revenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Activity</Label>
                    <p className="text-sm text-gray-900">
                      {selectedBrand.last_activity ? new Date(selectedBrand.last_activity).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials Section */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Brand Login Credentials</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        console.log('=== MANUAL DEBUG ===');
                        console.log('localStorage brandCredentials:', localStorage.getItem('brandCredentials'));
                        console.log('brandCredentials state:', credentials);
                        console.log('selectedBrand ID:', selectedBrand.id);
                        console.log('=== END MANUAL DEBUG ===');
                        alert('Check console for debug info');
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Debug
                    </Button>
                    <Button
                      onClick={() => handleFetchCredentials(selectedBrand.id)}
                      disabled={loadingCredentials}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loadingCredentials ? 'Loading...' : 'Get Credentials'}
                    </Button>
                  </div>
                </div>

                {credentials ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-900 font-mono">{credentials.email}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(credentials.email);
                              toast.success('Email copied to clipboard!');
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-900 font-mono">{credentials.password}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(credentials.password);
                              toast.success('Password copied to clipboard!');
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        💡 Send these credentials to the brand for portal access
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Click "Get Credentials" to retrieve the brand's login information
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {editModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Brand: {selectedBrand.brand_name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-brand-name" className="text-sm font-medium text-gray-700">
                      Brand Name
                    </Label>
                    <Input
                      id="edit-brand-name"
                      defaultValue={selectedBrand.brand_name}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <textarea
                      id="edit-description"
                      defaultValue={selectedBrand.description || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <Select defaultValue={selectedBrand.category || 'fashion'}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-commission" className="text-sm font-medium text-gray-700">
                      Commission Rate (%)
                    </Label>
                    <Input
                      id="edit-commission"
                      type="number"
                      defaultValue={selectedBrand.commission_rate || 10}
                      className="mt-1"
                    />
                  </div>
                  {/* Status field removed - backend doesn't allow status updates */}
                  </div>
                
                {/* Status Change Notice */}
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    ℹ️ Brand status changes require administrative approval and cannot be updated through this form.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-contact-email" className="text-sm font-medium text-gray-700">
                      Contact Email
                    </Label>
                    <Input
                      id="edit-contact-email"
                      defaultValue={selectedBrand.contact_email || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      defaultValue={selectedBrand.phone_number || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-address" className="text-sm font-medium text-gray-700">
                      Address
                    </Label>
                    <Input
                      id="edit-address"
                      defaultValue={selectedBrand.address || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-region" className="text-sm font-medium text-gray-700">
                      Region
                    </Label>
                    <Input
                      id="edit-region"
                      defaultValue={selectedBrand.region || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-district" className="text-sm font-medium text-gray-700">
                      District
                    </Label>
                    <Input
                      id="edit-district"
                      defaultValue={selectedBrand.district || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-website" className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <Input
                      id="edit-website"
                      defaultValue={selectedBrand.website_url || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-business-name" className="text-sm font-medium text-gray-700">
                      Business Name
                    </Label>
                    <Input
                      id="edit-business-name"
                      defaultValue={selectedBrand.business_name || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-contact-person" className="text-sm font-medium text-gray-700">
                      Contact Person
                    </Label>
                    <Input
                      id="edit-contact-person"
                      defaultValue={selectedBrand.contact_person || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone-alt" className="text-sm font-medium text-gray-700">
                      Alternative Phone
                    </Label>
                    <Input
                      id="edit-phone-alt"
                      defaultValue={selectedBrand.phone || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-registration" className="text-sm font-medium text-gray-700">
                      Registration Number
                    </Label>
                    <Input
                      id="edit-registration"
                      defaultValue={selectedBrand.registration_number || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-business-license" className="text-sm font-medium text-gray-700">
                      Business License
                    </Label>
                    <Input
                      id="edit-business-license"
                      defaultValue={selectedBrand.business_license || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tax-id" className="text-sm font-medium text-gray-700">
                      Tax ID
                    </Label>
                    <Input
                      id="edit-tax-id"
                      defaultValue={selectedBrand.tax_id || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tin" className="text-sm font-medium text-gray-700">
                      TIN Number
                    </Label>
                    <Input
                      id="edit-tin"
                      defaultValue={selectedBrand.tin_number || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-trade-license" className="text-sm font-medium text-gray-700">
                      Trade License
                    </Label>
                    <Input
                      id="edit-trade-license"
                      defaultValue={selectedBrand.trade_license || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-vat-registration" className="text-sm font-medium text-gray-700">
                      VAT Registration
                    </Label>
                    <Input
                      id="edit-vat-registration"
                      defaultValue={selectedBrand.vat_registration || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-import-export" className="text-sm font-medium text-gray-700">
                      Import/Export License
                    </Label>
                    <Input
                      id="edit-import-export"
                      defaultValue={selectedBrand.import_export_license || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-payment-method" className="text-sm font-medium text-gray-700">
                      Payment Method
                    </Label>
                    <Input
                      id="edit-payment-method"
                      defaultValue={selectedBrand.payment_method || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-payment-phone" className="text-sm font-medium text-gray-700">
                      Payment Phone
                    </Label>
                    <Input
                      id="edit-payment-phone"
                      defaultValue={selectedBrand.payment_phone || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-account-holder" className="text-sm font-medium text-gray-700">
                      Account Holder
                    </Label>
                    <Input
                      id="edit-account-holder"
                      defaultValue={selectedBrand.account_holder_name || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-payment-email" className="text-sm font-medium text-gray-700">
                      Payment Email
                    </Label>
                    <Input
                      id="edit-payment-email"
                      defaultValue={selectedBrand.payment_email || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Operational Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Operational Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-warehouse" className="text-sm font-medium text-gray-700">
                      Warehouse Location
                    </Label>
                    <Input
                      id="edit-warehouse"
                      defaultValue={selectedBrand.warehouse_location || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-physical-shops" className="text-sm font-medium text-gray-700">
                      Physical Shops
                    </Label>
                    <Input
                      id="edit-physical-shops"
                      defaultValue={selectedBrand.physical_shops || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-return-policy" className="text-sm font-medium text-gray-700">
                      Return Policy
                    </Label>
                    <Input
                      id="edit-return-policy"
                      defaultValue={selectedBrand.return_policy || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-warranty-policy" className="text-sm font-medium text-gray-700">
                      Warranty Policy
                    </Label>
                    <textarea
                      id="edit-warranty-policy"
                      defaultValue={selectedBrand.warranty_policy || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-min-order" className="text-sm font-medium text-gray-700">
                      Minimum Order Quantity
                    </Label>
                    <Input
                      id="edit-min-order"
                      defaultValue={selectedBrand.minimum_order_quantity || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-shipping-zones" className="text-sm font-medium text-gray-700">
                      Shipping Zones
                    </Label>
                    <Input
                      id="edit-shipping-zones"
                      defaultValue={selectedBrand.shipping_zones || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Partnership Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Partnership Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-payment-terms" className="text-sm font-medium text-gray-700">
                      Payment Terms
                    </Label>
                    <Input
                      id="edit-payment-terms"
                      defaultValue={selectedBrand.payment_terms || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-commission-structure" className="text-sm font-medium text-gray-700">
                      Commission Structure
                    </Label>
                    <textarea
                      id="edit-commission-structure"
                      defaultValue={selectedBrand.commission_structure || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-payment-schedule" className="text-sm font-medium text-gray-700">
                      Payment Schedule
                    </Label>
                    <Input
                      id="edit-payment-schedule"
                      defaultValue={selectedBrand.payment_schedule || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-min-payout" className="text-sm font-medium text-gray-700">
                      Minimum Payout Amount
                    </Label>
                    <Input
                      id="edit-min-payout"
                      defaultValue={selectedBrand.minimum_payout_amount || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tax-deduction" className="text-sm font-medium text-gray-700">
                      Tax Deduction Details
                    </Label>
                    <textarea
                      id="edit-tax-deduction"
                      defaultValue={selectedBrand.tax_deduction_details || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  {/* Duplicate commission rate field removed - using the one in Basic Information section */}
                </div>
              </div>

              {/* Brand Owner Account */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Brand Owner Account</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-owner-name" className="text-sm font-medium text-gray-700">
                      Owner Full Name
                    </Label>
                    <Input
                      id="edit-owner-name"
                      defaultValue={selectedBrand.owner_full_name || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-owner-email" className="text-sm font-medium text-gray-700">
                      Owner Email
                    </Label>
                    <Input
                      id="edit-owner-email"
                      defaultValue={selectedBrand.owner_email || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-owner-password" className="text-sm font-medium text-gray-700">
                      Owner Password
                    </Label>
                    <Input
                      id="edit-owner-password"
                      type="password"
                      defaultValue={selectedBrand.owner_password || ''}
                      className="mt-1"
                    />
                  </div>
                  {/* Owner Phone field removed - backend doesn't allow it to be updated */}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-facebook" className="text-sm font-medium text-gray-700">
                      Facebook URL
                    </Label>
                    <Input
                      id="edit-facebook"
                      defaultValue={selectedBrand.facebook_url || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-instagram" className="text-sm font-medium text-gray-700">
                      Instagram URL
                    </Label>
                    <Input
                      id="edit-instagram"
                      defaultValue={selectedBrand.instagram_url || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-twitter" className="text-sm font-medium text-gray-700">
                      Twitter URL
                    </Label>
                    <Input
                      id="edit-twitter"
                      defaultValue={selectedBrand.twitter_url || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-linkedin" className="text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </Label>
                    <Input
                      id="edit-linkedin"
                      defaultValue={selectedBrand.linkedin_url || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Assets */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Brand Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-logo-url" className="text-sm font-medium text-gray-700">
                      Logo URL
                    </Label>
                    <Input
                      id="edit-logo-url"
                      defaultValue={selectedBrand.logo_url || ''}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-banner-url" className="text-sm font-medium text-gray-700">
                      Banner URL
                    </Label>
                    <Input
                      id="edit-banner-url"
                      defaultValue={selectedBrand.banner_url || ''}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Technical & Integration */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Technical & Integration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-api-keys" className="text-sm font-medium text-gray-700">
                      API Keys
                    </Label>
                    <textarea
                      id="edit-api-keys"
                      defaultValue={selectedBrand.api_keys || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-webhooks" className="text-sm font-medium text-gray-700">
                      Webhook URLs
                    </Label>
                    <textarea
                      id="edit-webhooks"
                      defaultValue={selectedBrand.webhook_urls || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-integration" className="text-sm font-medium text-gray-700">
                      Integration Settings
                    </Label>
                    <textarea
                      id="edit-integration"
                      defaultValue={selectedBrand.integration_settings || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveBrand}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 