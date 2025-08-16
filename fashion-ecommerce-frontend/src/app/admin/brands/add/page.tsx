"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, ShoppingBag, Package, TrendingUp, ArrowRight, 
  Home, Tag, Box, Clipboard, CreditCard, Truck, 
  BarChart3, Settings, Mail, Bell, AlertTriangle, 
  X, CheckCircle, ChevronRight, Settings as SettingsIcon,
  Megaphone, Plus, Cog, MessageSquare, User, LogOut, ChevronDown,
  Clock, Plus as PlusIcon, DollarSign, Tag as TagIcon,
  ArrowLeft, Upload, Globe, Phone, Building, FileText, Eye, EyeOff, Save
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { apiService } from "@/lib/api";
import { adminLogout, requireAdminAuth } from "@/lib/admin-auth";
import { toast } from "sonner";

export default function AddBrand() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    brandName: '',
    brandLogo: '',
    description: '',
    websiteUrl: '',
    contactEmail: '',
    phoneNumber: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    region: '',
    district: '',
    category: '',
    commissionRate: '',
    paymentTerms: '',
    status: 'active',
    ownerFullName: '',
    ownerEmail: '',
    ownerPassword: '',
    brandBanner: '',
    brandLogoFile: '',
    // Payment Info fields
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    routingNumber: '',
    swiftCode: '',
    paymentMethod: '',
    paymentEmail: '',
    mobileBankingPhone: '',
    mobileBankingName: '',
    // Social Media Links
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    // Business & Legal Information
    businessLicenseNumber: '',
    tinNumber: '',
    tradeLicense: '',
    vatRegistration: '',
    importExportLicense: '',
    // Operational Details
    warehouseLocation: '',
    physicalShops: '',
    returnPolicy: '',
    warrantyPolicy: '',
    minimumOrderQuantity: '',
    shippingZones: '',
    // Financial & Commission Details
    commissionStructure: '',
    paymentSchedule: '',
    minimumPayoutAmount: '',
    taxDeductionDetails: '',
    // Technical & Integration
    apiKeys: '',
    webhookUrls: '',
    integrationSettings: '',
    // Form validation state
    errors: {} as Record<string, string>
  });

  const [previews, setPreviews] = useState<{
    banner: string | null;
    logo: string | null;
  }>({
    banner: null,
    logo: null
  });

  const [debugMode, setDebugMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      // For now, we'll create a local file path
      // In production, you'd upload to a cloud service and get a URL
      const fileName = `${field}_${Date.now()}_${file.name}`;
      const filePath = `/uploads/brands/${fileName}`;
      
      setFormData(prev => ({
        ...prev,
        [field]: filePath
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [field]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      setPreviews(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileUpload('brandLogo', file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileUpload('brandBanner', file);
  };

  const handleBannerUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      brandBanner: url
    }));
    if (url) {
      setPreviews(prev => ({
        ...prev,
        banner: url
      }));
    }
  };

  // Form validation
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'brandName':
        return value.length < 2 ? 'Brand name must be at least 2 characters' : '';
      case 'contactEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phoneNumber':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return value && !phoneRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid phone number' : '';
      case 'websiteUrl':
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        return '';
      case 'ownerEmail':
        const ownerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !ownerEmailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'ownerPassword':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Validate field
    const error = validateField(field, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));

    // Auto-save to localStorage
    const autoSaveData = {
      ...formData,
      [field]: value,
      errors: {
        ...formData.errors,
        [field]: error
      }
    };
    localStorage.setItem('brandFormDraft', JSON.stringify(autoSaveData));
  };

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('brandFormDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draft }));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Check authentication on component mount
  useEffect(() => {
    requireAdminAuth(router);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    // Validate all required fields
    const requiredFields = ['brandName', 'contactEmail', 'ownerFullName', 'ownerEmail', 'ownerPassword'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormData(prev => ({
        ...prev,
        errors: { ...prev.errors, ...newErrors }
      }));
      return;
    }

    // Clear draft from localStorage
    localStorage.removeItem('brandFormDraft');
    
    try {
      setIsSubmitting(true);
      
      // Create the brand directly (backend will handle defaults)
      const brandData: any = {
        // Basic Information
        brand_name: formData.brandName,
        business_name: formData.brandName, // Use brand name as business name if not specified
        description: formData.description || '',
        contact_email: formData.contactEmail,
        phone_number: formData.phoneNumber || undefined,
        logo_url: formData.brandLogo || undefined,
        banner_url: formData.brandBanner || undefined,
        website_url: formData.websiteUrl || undefined,
        website: formData.websiteUrl || undefined,
        category: formData.category || undefined,

        // Social Media Links
        facebook_url: formData.facebookUrl || undefined,
        instagram_url: formData.instagramUrl || undefined,
        twitter_url: formData.twitterUrl || undefined,
        linkedin_url: formData.linkedinUrl || undefined,

        // Contact Information
        contact_person: formData.ownerFullName || undefined, // Use owner name as contact person
        phone: formData.phoneNumber || undefined, // Alternative phone field
        address: formData.address || undefined,
        region: formData.region || undefined,
        district: formData.district || undefined,

        // Business Details
        registration_number: formData.registrationNumber || undefined,
        business_license: formData.businessLicenseNumber || undefined,
        tax_id: formData.taxId || undefined,
        tin_number: formData.tinNumber || undefined,
        trade_license: formData.tradeLicense || undefined,
        vat_registration: formData.vatRegistration || undefined,
        import_export_license: formData.importExportLicense || undefined,

        // Payment Info
        payment_method: formData.paymentMethod || undefined,
        payment_phone: formData.mobileBankingPhone || undefined,
        account_holder_name: formData.mobileBankingName || undefined,
        payment_email: formData.paymentEmail || undefined,

        // Operational Details
        warehouse_location: formData.warehouseLocation || undefined,
        physical_shops: formData.physicalShops || undefined,
        return_policy: formData.returnPolicy || undefined,
        warranty_policy: formData.warrantyPolicy || undefined,
        minimum_order_quantity: formData.minimumOrderQuantity || undefined,
        shipping_zones: formData.shippingZones || undefined,

        // Partnership Settings
        commission_rate: formData.commissionRate ? parseInt(formData.commissionRate) : undefined,
        payment_terms: formData.paymentTerms || undefined,
        commission_structure: formData.commissionStructure || undefined,
        payment_schedule: formData.paymentSchedule || undefined,
        minimum_payout_amount: formData.minimumPayoutAmount || undefined,
        tax_deduction_details: formData.taxDeductionDetails || undefined,

        // Brand Owner Account
        owner_full_name: formData.ownerFullName || undefined,
        owner_email: formData.ownerEmail || undefined,
        owner_password: formData.ownerPassword || undefined,

        // Technical & Integration
        api_keys: formData.apiKeys || undefined,
        webhook_urls: formData.webhookUrls || undefined,
        integration_settings: formData.integrationSettings || undefined
      };

      console.log('Creating brand:', brandData);
      const brandResponse = await apiService.createBrand(brandData);
      
      console.log('Brand created successfully:', brandResponse);
      
      // Show success message with login credentials
      if (brandResponse && brandResponse.data) {
        const responseData = brandResponse.data as any;
        console.log('=== BRAND CREATION DEBUG ===');
        console.log('Full response:', brandResponse);
        console.log('Response data:', responseData);
        console.log('Login credentials:', responseData.loginCredentials);
        console.log('Brand data:', responseData.brand);
        
        if (responseData.loginCredentials) {
          const credentials = responseData.loginCredentials;
          
          const message = `
Brand created successfully!

📧 Brand Login Credentials:
Email: ${credentials.email}
Password: ${credentials.password}

⚠️ IMPORTANT: Send these credentials to the brand for portal access.
          `;
          alert(message);
        } else {
          console.log('No login credentials found in response');
          alert('Brand created successfully!');
        }
      } else {
        alert('Brand created successfully!');
      }
      
      // Redirect to brands list
      router.push('/admin/brands');
      
    } catch (error) {
      console.error('Error creating brand:', error);
      
      let errorMessage = 'Failed to create brand. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Insufficient permissions.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    adminLogout(router);
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/admin/brands')}
                className="flex items-center space-x-2 text-xs"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Brands</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add New Brand</h1>
                <p className="text-gray-600 text-xs">Create a new brand partner account</p>
              </div>
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

        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
            {/* Form Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Form Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round((Object.keys(formData).filter(key => formData[key as keyof typeof formData] && key !== 'errors').length / (Object.keys(formData).length - 1)) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(Object.keys(formData).filter(key => formData[key as keyof typeof formData] && key !== 'errors').length / (Object.keys(formData).length - 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Error Summary */}
            {Object.keys(formData.errors).filter(key => formData.errors[key]).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-800">Please fix the following errors:</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.keys(formData.errors).map(key => 
                    formData.errors[key] && (
                      <li key={key} className="flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                        {key === 'brandName' && 'Brand Name'}
                        {key === 'contactEmail' && 'Contact Email'}
                        {key === 'ownerFullName' && 'Owner Full Name'}
                        {key === 'ownerEmail' && 'Owner Email'}
                        {key === 'ownerPassword' && 'Owner Password'}
                        : {formData.errors[key]}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Basic Information */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Enter the essential details about the brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="brandName" className="block mb-1 text-xs font-medium text-gray-700">Brand Name *</Label>
                      <Input
                        id="brandName"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                        placeholder="Enter brand name"
                        required
                        className={`mt-1 h-8 text-sm ${formData.errors.brandName ? 'border-red-500' : ''}`}
                      />
                      {formData.errors.brandName && (
                        <p className="text-xs text-red-600 mt-1">{formData.errors.brandName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="category" className="block mb-1 text-xs font-medium text-gray-700">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports & Outdoor</SelectItem>
                          <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="books">Books & Media</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="block mb-1 text-xs font-medium text-gray-700">Brand Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of the brand"
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="websiteUrl" className="block mb-1 text-xs font-medium text-gray-700">Website URL</Label>
                        <div className="relative mt-1">
                          <Globe className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                          <Input
                            id="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                            placeholder="https://example.com"
                            className="pl-7 h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="brandLogo" className="block mb-1 text-xs font-medium text-gray-700">Brand Logo URL</Label>
                        <div className="relative mt-1">
                          <Upload className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                          <Input
                            id="brandLogo"
                            value={formData.brandLogo}
                            onChange={(e) => handleInputChange('brandLogo', e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="pl-7 h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Social Media Links */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>Social Media Links</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Brand's social media presence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebookUrl" className="block mb-1 text-xs font-medium text-gray-700">Facebook URL</Label>
                        <Input
                          id="facebookUrl"
                          value={formData.facebookUrl}
                          onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                          placeholder="https://facebook.com/brandname"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramUrl" className="block mb-1 text-xs font-medium text-gray-700">Instagram URL</Label>
                        <Input
                          id="instagramUrl"
                          value={formData.instagramUrl}
                          onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                          placeholder="https://instagram.com/brandname"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitterUrl" className="block mb-1 text-xs font-medium text-gray-700">Twitter URL</Label>
                        <Input
                          id="twitterUrl"
                          value={formData.twitterUrl}
                          onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                          placeholder="https://twitter.com/brandname"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinUrl" className="block mb-1 text-xs font-medium text-gray-700">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/company/brandname"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Primary contact details for the brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="contactEmail" className="block mb-1 text-xs font-medium text-gray-700">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contact@brand.com"
                        required
                        className={`mt-1 h-8 text-sm ${formData.errors.contactEmail ? 'border-red-500' : ''}`}
                      />
                      {formData.errors.contactEmail && (
                        <p className="text-xs text-red-600 mt-1">{formData.errors.contactEmail}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber" className="block mb-1 text-xs font-medium text-gray-700">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="block mb-1 text-xs font-medium text-gray-700">Business Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete business address"
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="region" className="block mb-1 text-xs font-medium text-gray-700">Region</Label>
                        <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dhaka">Dhaka Division</SelectItem>
                            <SelectItem value="chittagong">Chittagong Division</SelectItem>
                            <SelectItem value="rajshahi">Rajshahi Division</SelectItem>
                            <SelectItem value="khulna">Khulna Division</SelectItem>
                            <SelectItem value="barisal">Barisal Division</SelectItem>
                            <SelectItem value="sylhet">Sylhet Division</SelectItem>
                            <SelectItem value="rangpur">Rangpur Division</SelectItem>
                            <SelectItem value="mymensingh">Mymensingh Division</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>
                      <div>
                        <Label htmlFor="district" className="block mb-1 text-xs font-medium text-gray-700">District</Label>
                        <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search districts..."
                                className="mb-2"
                                onChange={(e) => {
                                  const searchTerm = e.target.value.toLowerCase();
                                  const items = document.querySelectorAll('[data-district]');
                                  items.forEach((item) => {
                                    const text = item.textContent?.toLowerCase() || '';
                                    if (text.includes(searchTerm)) {
                                      item.classList.remove('hidden');
                                    } else {
                                      item.classList.add('hidden');
                                    }
                                  });
                                }}
                              />
                            </div>
                            {/* Dhaka Division Districts */}
                            <SelectItem value="dhaka" data-district>Dhaka</SelectItem>
                            <SelectItem value="gazipur" data-district>Gazipur</SelectItem>
                            <SelectItem value="narayanganj" data-district>Narayanganj</SelectItem>
                            <SelectItem value="tangail" data-district>Tangail</SelectItem>
                            <SelectItem value="narsingdi" data-district>Narsingdi</SelectItem>
                            <SelectItem value="kishoreganj" data-district>Kishoreganj</SelectItem>
                            <SelectItem value="munshiganj" data-district>Munshiganj</SelectItem>
                            <SelectItem value="madaripur" data-district>Madaripur</SelectItem>
                            <SelectItem value="gopalganj" data-district>Gopalganj</SelectItem>
                            <SelectItem value="rajbari" data-district>Rajbari</SelectItem>
                            <SelectItem value="shariatpur" data-district>Shariatpur</SelectItem>
                            <SelectItem value="faridpur" data-district>Faridpur</SelectItem>
                            
                            {/* Chittagong Division Districts */}
                            <SelectItem value="chittagong" data-district>Chittagong</SelectItem>
                            <SelectItem value="comilla" data-district>Comilla</SelectItem>
                            <SelectItem value="chandpur" data-district>Chandpur</SelectItem>
                            <SelectItem value="lakshmipur" data-district>Lakshmipur</SelectItem>
                            <SelectItem value="noakhali" data-district>Noakhali</SelectItem>
                            <SelectItem value="feni" data-district>Feni</SelectItem>
                            <SelectItem value="bandarban" data-district>Bandarban</SelectItem>
                            <SelectItem value="rangamati" data-district>Rangamati</SelectItem>
                            <SelectItem value="khagrachari" data-district>Khagrachari</SelectItem>
                            <SelectItem value="cox_bazar" data-district>Cox's Bazar</SelectItem>
                            
                            {/* Rajshahi Division Districts */}
                            <SelectItem value="rajshahi" data-district>Rajshahi</SelectItem>
                            <SelectItem value="natore" data-district>Natore</SelectItem>
                            <SelectItem value="naogaon" data-district>Naogaon</SelectItem>
                            <SelectItem value="chapainawabganj" data-district>Chapainawabganj</SelectItem>
                            <SelectItem value="pabna" data-district>Pabna</SelectItem>
                            <SelectItem value="bogura" data-district>Bogura</SelectItem>
                            <SelectItem value="sirajganj" data-district>Sirajganj</SelectItem>
                            <SelectItem value="joypurhat" data-district>Joypurhat</SelectItem>
                            
                            {/* Khulna Division Districts */}
                            <SelectItem value="khulna" data-district>Khulna</SelectItem>
                            <SelectItem value="bagerhat" data-district>Bagerhat</SelectItem>
                            <SelectItem value="satkhira" data-district>Satkhira</SelectItem>
                            <SelectItem value="jessore" data-district>Jessore</SelectItem>
                            <SelectItem value="magura" data-district>Magura</SelectItem>
                            <SelectItem value="jhenaidah" data-district>Jhenaidah</SelectItem>
                            <SelectItem value="kushtia" data-district>Kushtia</SelectItem>
                            <SelectItem value="chuadanga" data-district>Chuadanga</SelectItem>
                            <SelectItem value="meherpur" data-district>Meherpur</SelectItem>
                            <SelectItem value="narail" data-district>Narail</SelectItem>
                            
                            {/* Barisal Division Districts */}
                            <SelectItem value="barisal" data-district>Barisal</SelectItem>
                            <SelectItem value="bhola" data-district>Bhola</SelectItem>
                            <SelectItem value="patuakhali" data-district>Patuakhali</SelectItem>
                            <SelectItem value="pirojpur" data-district>Pirojpur</SelectItem>
                            <SelectItem value="barguna" data-district>Barguna</SelectItem>
                            <SelectItem value="jhalokati" data-district>Jhalokati</SelectItem>
                            
                            {/* Sylhet Division Districts */}
                            <SelectItem value="sylhet" data-district>Sylhet</SelectItem>
                            <SelectItem value="moulvibazar" data-district>Moulvibazar</SelectItem>
                            <SelectItem value="habiganj" data-district>Habiganj</SelectItem>
                            <SelectItem value="sunamganj" data-district>Sunamganj</SelectItem>
                            
                            {/* Rangpur Division Districts */}
                            <SelectItem value="rangpur" data-district>Rangpur</SelectItem>
                            <SelectItem value="dinajpur" data-district>Dinajpur</SelectItem>
                            <SelectItem value="kurigram" data-district>Kurigram</SelectItem>
                            <SelectItem value="gaibandha" data-district>Gaibandha</SelectItem>
                            <SelectItem value="nilphamari" data-district>Nilphamari</SelectItem>
                            <SelectItem value="panchagarh" data-district>Panchagarh</SelectItem>
                            <SelectItem value="thakurgaon" data-district>Thakurgaon</SelectItem>
                            <SelectItem value="lalmonirhat" data-district>Lalmonirhat</SelectItem>
                            
                            {/* Mymensingh Division Districts */}
                            <SelectItem value="mymensingh" data-district>Mymensingh</SelectItem>
                            <SelectItem value="jamalpur" data-district>Jamalpur</SelectItem>
                            <SelectItem value="sherpur" data-district>Sherpur</SelectItem>
                            <SelectItem value="netrokona" data-district>Netrokona</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span>Business Details</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Legal and business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registrationNumber" className="block mb-1 text-xs font-medium text-gray-700">Company Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        placeholder="Enter registration number"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                      <div>
                        <Label htmlFor="businessLicenseNumber" className="block mb-1 text-xs font-medium text-gray-700">Business License Number</Label>
                        <Input
                          id="businessLicenseNumber"
                          value={formData.businessLicenseNumber}
                          onChange={(e) => handleInputChange('businessLicenseNumber', e.target.value)}
                          placeholder="Enter business license number"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxId" className="block mb-1 text-xs font-medium text-gray-700">Tax ID/VAT Number</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        placeholder="Enter tax identification number"
                        className="mt-1 h-8 text-sm"
                      />
                      </div>
                      <div>
                        <Label htmlFor="tinNumber" className="block mb-1 text-xs font-medium text-gray-700">TIN Number</Label>
                        <Input
                          id="tinNumber"
                          value={formData.tinNumber}
                          onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                          placeholder="Enter TIN number"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tradeLicense" className="block mb-1 text-xs font-medium text-gray-700">Trade License</Label>
                        <Input
                          id="tradeLicense"
                          value={formData.tradeLicense}
                          onChange={(e) => handleInputChange('tradeLicense', e.target.value)}
                          placeholder="Enter trade license number"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vatRegistration" className="block mb-1 text-xs font-medium text-gray-700">VAT Registration</Label>
                        <Select value={formData.vatRegistration} onValueChange={(value) => handleInputChange('vatRegistration', value)}>
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select VAT status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="registered">Registered</SelectItem>
                            <SelectItem value="not_registered">Not Registered</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="exempt">Exempt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="importExportLicense" className="block mb-1 text-xs font-medium text-gray-700">Import/Export License</Label>
                      <Input
                        id="importExportLicense"
                        value={formData.importExportLicense}
                        onChange={(e) => handleInputChange('importExportLicense', e.target.value)}
                        placeholder="Enter import/export license number (if applicable)"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span>Payment Info</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Bank account and payment method details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Payment Method Selection */}
                    <div>
                      <Label htmlFor="paymentMethod" className="block mb-1 text-xs font-medium text-gray-700">Preferred Payment Method</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="razorpay">Razorpay</SelectItem>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="rocket">Rocket</SelectItem>
                          <SelectItem value="upay">Upay</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bank Transfer Fields */}
                    {formData.paymentMethod === 'bank_transfer' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="bankName" className="block mb-1 text-xs font-medium text-gray-700">Bank Name</Label>
                            <Input
                              id="bankName"
                              value={formData.bankName}
                              onChange={(e) => handleInputChange('bankName', e.target.value)}
                              placeholder="Enter bank name"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="accountNumber" className="block mb-1 text-xs font-medium text-gray-700">Account Number</Label>
                            <Input
                              id="accountNumber"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                              placeholder="Enter account number"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="accountHolderName" className="block mb-1 text-xs font-medium text-gray-700">Account Holder Name</Label>
                            <Input
                              id="accountHolderName"
                              value={formData.accountHolderName}
                              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                              placeholder="Enter account holder name"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="routingNumber" className="block mb-1 text-xs font-medium text-gray-700">Routing Number</Label>
                            <Input
                              id="routingNumber"
                              value={formData.routingNumber}
                              onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                              placeholder="Enter routing number"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="swiftCode" className="block mb-1 text-xs font-medium text-gray-700">SWIFT Code</Label>
                          <Input
                            id="swiftCode"
                            value={formData.swiftCode}
                            onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                            placeholder="Enter SWIFT code"
                            className="mt-1 h-8 text-sm"
                          />
                        </div>
                      </>
                    )}

                    {/* Mobile Banking Fields */}
                    {['bkash', 'nagad', 'rocket', 'upay'].includes(formData.paymentMethod) && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="mobileBankingPhone" className="block mb-1 text-xs font-medium text-gray-700">
                              {formData.paymentMethod === 'bkash' ? 'bKash' : 
                               formData.paymentMethod === 'nagad' ? 'Nagad' : 
                               formData.paymentMethod === 'rocket' ? 'Rocket' : 'Upay'} Phone Number
                            </Label>
                            <Input
                              id="mobileBankingPhone"
                              value={formData.mobileBankingPhone}
                              onChange={(e) => handleInputChange('mobileBankingPhone', e.target.value)}
                              placeholder={`Enter ${formData.paymentMethod === 'bkash' ? 'bKash' : 
                                          formData.paymentMethod === 'nagad' ? 'Nagad' : 
                                          formData.paymentMethod === 'rocket' ? 'Rocket' : 'Upay'} phone number`}
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mobileBankingName" className="block mb-1 text-xs font-medium text-gray-700">Account Holder Name</Label>
                            <Input
                              id="mobileBankingName"
                              value={formData.mobileBankingName}
                              onChange={(e) => handleInputChange('mobileBankingName', e.target.value)}
                              placeholder="Enter account holder name"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                          <p className="text-xs text-blue-800">
                            <strong>Note:</strong> For {formData.paymentMethod === 'bkash' ? 'bKash' : 
                                                   formData.paymentMethod === 'nagad' ? 'Nagad' : 
                                                   formData.paymentMethod === 'rocket' ? 'Rocket' : 'Upay'} payments, 
                            please ensure the phone number is registered and verified with the service provider.
                          </p>
                        </div>
                      </>
                    )}

                    {/* PayPal Fields */}
                    {formData.paymentMethod === 'paypal' && (
                      <div>
                        <Label htmlFor="paymentEmail" className="block mb-1 text-xs font-medium text-gray-700">PayPal Email</Label>
                        <Input
                          id="paymentEmail"
                          type="email"
                          value={formData.paymentEmail}
                          onChange={(e) => handleInputChange('paymentEmail', e.target.value)}
                          placeholder="Enter PayPal email address"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    )}

                    {/* Stripe/Razorpay Fields */}
                    {['stripe', 'razorpay'].includes(formData.paymentMethod) && (
                      <div>
                        <Label htmlFor="paymentEmail" className="block mb-1 text-xs font-medium text-gray-700">Payment Email</Label>
                        <Input
                          id="paymentEmail"
                          type="email"
                          value={formData.paymentEmail}
                          onChange={(e) => handleInputChange('paymentEmail', e.target.value)}
                          placeholder="Enter payment notification email"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    )}

                    {/* Check/Cash Fields */}
                    {['check', 'cash'].includes(formData.paymentMethod) && (
                      <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> For {formData.paymentMethod === 'check' ? 'check' : 'cash'} payments, 
                          payment details will be handled manually. Please contact the finance team for arrangements.
                        </p>
                      </div>
                    )}

                    {/* Payment Email for all methods except check/cash */}
                    {!['check', 'cash'].includes(formData.paymentMethod) && formData.paymentMethod && (
                      <div>
                        <Label htmlFor="paymentEmail" className="block mb-1 text-xs font-medium text-gray-700">Payment Notification Email</Label>
                        <Input
                          id="paymentEmail"
                          type="email"
                          value={formData.paymentEmail}
                          onChange={(e) => handleInputChange('paymentEmail', e.target.value)}
                          placeholder="Enter payment notification email"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Operational Details */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Truck className="h-4 w-4 text-orange-600" />
                    <span>Operational Details</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Warehouse, shipping, and operational information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="warehouseLocation" className="block mb-1 text-xs font-medium text-gray-700">Warehouse Location</Label>
                      <Textarea
                        id="warehouseLocation"
                        value={formData.warehouseLocation}
                        onChange={(e) => handleInputChange('warehouseLocation', e.target.value)}
                        placeholder="Enter warehouse address and details"
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="physicalShops" className="block mb-1 text-xs font-medium text-gray-700">Physical Shops/Locations</Label>
                      <Textarea
                        id="physicalShops"
                        value={formData.physicalShops}
                        onChange={(e) => handleInputChange('physicalShops', e.target.value)}
                        placeholder="Enter physical shop addresses and locations"
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="returnPolicy" className="block mb-1 text-xs font-medium text-gray-700">Return Policy</Label>
                        <Textarea
                          id="returnPolicy"
                          value={formData.returnPolicy}
                          onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                          placeholder="Enter return policy details"
                          rows={2}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="warrantyPolicy" className="block mb-1 text-xs font-medium text-gray-700">Warranty Policy</Label>
                        <Textarea
                          id="warrantyPolicy"
                          value={formData.warrantyPolicy}
                          onChange={(e) => handleInputChange('warrantyPolicy', e.target.value)}
                          placeholder="Enter warranty policy details"
                          rows={2}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minimumOrderQuantity" className="block mb-1 text-xs font-medium text-gray-700">Minimum Order Quantity</Label>
                        <Input
                          id="minimumOrderQuantity"
                          value={formData.minimumOrderQuantity}
                          onChange={(e) => handleInputChange('minimumOrderQuantity', e.target.value)}
                          placeholder="Enter minimum order quantity"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingZones" className="block mb-1 text-xs font-medium text-gray-700">Shipping Zones</Label>
                        <Select value={formData.shippingZones} onValueChange={(value) => handleInputChange('shippingZones', value)}>
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select shipping zones" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local (Same City)</SelectItem>
                            <SelectItem value="regional">Regional (Same Division)</SelectItem>
                            <SelectItem value="national">National (All Bangladesh)</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                            <SelectItem value="custom">Custom Zones</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partnership Settings */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Settings className="h-4 w-4 text-orange-600" />
                    <span>Partnership Settings</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Configure partnership terms and conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commissionRate" className="block mb-1 text-xs font-medium text-gray-700">Commission Rate (%)</Label>
                      <Input
                        id="commissionRate"
                        type="number"
                        value={formData.commissionRate}
                        onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                        placeholder="15"
                        min="0"
                        max="100"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentTerms" className="block mb-1 text-xs font-medium text-gray-700">Payment Terms</Label>
                      <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                          <SelectItem value="immediate">Immediate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="commissionStructure" className="block mb-1 text-xs font-medium text-gray-700">Commission Structure</Label>
                        <Textarea
                          id="commissionStructure"
                          value={formData.commissionStructure}
                          onChange={(e) => handleInputChange('commissionStructure', e.target.value)}
                          placeholder="Enter detailed commission structure for different categories"
                          rows={2}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentSchedule" className="block mb-1 text-xs font-medium text-gray-700">Payment Schedule</Label>
                        <Select value={formData.paymentSchedule} onValueChange={(value) => handleInputChange('paymentSchedule', value)}>
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue placeholder="Select payment schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="on_demand">On Demand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minimumPayoutAmount" className="block mb-1 text-xs font-medium text-gray-700">Minimum Payout Amount</Label>
                        <Input
                          id="minimumPayoutAmount"
                          type="number"
                          value={formData.minimumPayoutAmount}
                          onChange={(e) => handleInputChange('minimumPayoutAmount', e.target.value)}
                          placeholder="Enter minimum payout amount"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxDeductionDetails" className="block mb-1 text-xs font-medium text-gray-700">Tax Deduction Details</Label>
                        <Textarea
                          id="taxDeductionDetails"
                          value={formData.taxDeductionDetails}
                          onChange={(e) => handleInputChange('taxDeductionDetails', e.target.value)}
                          placeholder="Enter tax deduction information"
                          rows={2}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status" className="block mb-1 text-xs font-medium text-gray-700">Brand Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Owner Account */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-red-600" />
                    <span>Brand Owner Account</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Create or assign the user account who will manage this brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="ownerFullName" className="block mb-1 text-xs font-medium text-gray-700">Full Name *</Label>
                      <Input
                        id="ownerFullName"
                        value={formData.ownerFullName}
                        onChange={(e) => handleInputChange('ownerFullName', e.target.value)}
                        placeholder="Enter full name"
                        required
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerEmail" className="block mb-1 text-xs font-medium text-gray-700">Email *</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                        placeholder="owner@brand.com"
                        required
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerPassword" className="block mb-1 text-xs font-medium text-gray-700">Password *</Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                        <Input
                          id="ownerPassword"
                            type={showPassword ? "text" : "password"}
                          value={formData.ownerPassword}
                          onChange={(e) => handleInputChange('ownerPassword', e.target.value)}
                          placeholder="Enter password"
                          required
                            className="mt-1 h-8 text-sm pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const password = Math.random().toString(36).slice(-8);
                            handleInputChange('ownerPassword', password);
                          }}
                          className="mt-1 h-8 text-xs"
                        >
                          Auto Generate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="block mb-1 text-xs font-medium text-gray-700">Role</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md border">
                        <span className="text-xs text-gray-600">Brand Owner (Auto-assigned)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical & Integration */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Cog className="h-4 w-4 text-gray-600" />
                    <span>Technical & Integration</span>
                  </CardTitle>
                  <CardDescription className="text-xs">API keys, webhooks, and integration settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="apiKeys" className="block mb-1 text-xs font-medium text-gray-700">API Keys</Label>
                      <Input
                        id="apiKeys"
                        value={formData.apiKeys}
                        onChange={(e) => handleInputChange('apiKeys', e.target.value)}
                        placeholder="Enter API keys for integration"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhookUrls" className="block mb-1 text-xs font-medium text-gray-700">Webhook URLs</Label>
                      <Input
                        id="webhookUrls"
                        value={formData.webhookUrls}
                        onChange={(e) => handleInputChange('webhookUrls', e.target.value)}
                        placeholder="Enter webhook URLs for notifications"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="integrationSettings" className="block mb-1 text-xs font-medium text-gray-700">Integration Settings</Label>
                      <Textarea
                        id="integrationSettings"
                        value={formData.integrationSettings}
                        onChange={(e) => handleInputChange('integrationSettings', e.target.value)}
                        placeholder="Enter additional integration settings and configurations"
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Assets */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Upload className="h-4 w-4 text-indigo-600" />
                    <span>Brand Assets</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Upload brand images for promotional use</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="brandBanner" className="block mb-1 text-xs font-medium text-gray-700">Banner Image</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            id="brandBanner"
                            value={formData.brandBanner}
                            onChange={(e) => handleBannerUrlChange(e.target.value)}
                            placeholder="https://example.com/banner.jpg"
                            className="mt-1 h-8 text-sm"
                          />
                          <input
                            type="file"
                            ref={bannerFileInputRef}
                            accept="image/*"
                            onChange={(e) => handleBannerUpload(e)}
                            className="hidden"
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="mt-1 h-8 text-xs"
                          >
                            Upload
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Upload banner image for promotional carousels and brand pages</p>
                        {previews.banner && (
                          <div className="mt-3">
                            <h3 className="text-xs font-medium text-gray-700 mb-1">Preview:</h3>
                            <img src={previews.banner} alt="Banner Preview" className="max-w-full h-auto rounded-md max-h-20" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="brandLogoFile" className="block mb-1 text-xs font-medium text-gray-700">Logo File</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            ref={logoFileInputRef}
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e)}
                            className="hidden"
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="mt-1 h-8 text-xs"
                          >
                            Upload Logo
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Upload logo file (PNG, JPG, SVG recommended)</p>
                        {previews.logo && (
                          <div className="mt-3">
                            <h3 className="text-xs font-medium text-gray-700 mb-1">Preview:</h3>
                            <img src={previews.logo} alt="Logo Preview" className="max-w-full h-auto rounded-md max-h-16" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                  onClick={() => {
                    localStorage.setItem('brandFormDraft', JSON.stringify(formData));
                    alert('Draft saved successfully!');
                  }}
                  className="hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the form?')) {
                      setFormData({
                        brandName: '',
                        brandLogo: '',
                        description: '',
                        websiteUrl: '',
                        contactEmail: '',
                        phoneNumber: '',
                        registrationNumber: '',
                        taxId: '',
                        address: '',
                        region: '',
                        district: '',
                        category: '',
                        commissionRate: '',
                        paymentTerms: '',
                        status: 'active',
                        ownerFullName: '',
                        ownerEmail: '',
                        ownerPassword: '',
                        brandBanner: '',
                        brandLogoFile: '',
                        bankName: '',
                        accountNumber: '',
                        accountHolderName: '',
                        routingNumber: '',
                        swiftCode: '',
                        paymentMethod: '',
                        paymentEmail: '',
                        mobileBankingPhone: '',
                        mobileBankingName: '',
                        facebookUrl: '',
                        instagramUrl: '',
                        twitterUrl: '',
                        linkedinUrl: '',
                        businessLicenseNumber: '',
                        tinNumber: '',
                        tradeLicense: '',
                        vatRegistration: '',
                        importExportLicense: '',
                        warehouseLocation: '',
                        physicalShops: '',
                        returnPolicy: '',
                        warrantyPolicy: '',
                        minimumOrderQuantity: '',
                        shippingZones: '',
                        commissionStructure: '',
                        paymentSchedule: '',
                        minimumPayoutAmount: '',
                        taxDeductionDetails: '',
                        apiKeys: '',
                        webhookUrls: '',
                        integrationSettings: '',
                        errors: {}
                      });
                      localStorage.removeItem('brandFormDraft');
                    }
                  }}
                  className="hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Form
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/brands')}
                className="hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Brand...
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Create Brand
                  </>
                )}
              </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 