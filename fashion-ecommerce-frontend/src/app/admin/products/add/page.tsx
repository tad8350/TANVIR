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
  ArrowLeft, Upload, Globe, Phone, Building, FileText, Eye, EyeOff, Save,
  Image, Palette, Ruler, Hash, Trash2, Star
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

export default function AddProduct() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    category: '',
    categoryLevel1: '', // MEN or WOMEN or KIDS
    categoryLevel2: '', // Clothing, Shoes, Accessories
    categoryLevel3: '', // T-shirts, Polo Shirts, Shirts, etc.
    categoryLevel4: '', // Basic T-shirts, Printed T-shirts, etc.
    brand: '',
    status: 'active', // Set default status
    // Inventory fields
    lowStockThreshold: '',
    // Color blocks
    colorBlocks: [] as Array<{
      id: string;
      color: string;
      newColor: string;
      images: File[];
      sizes: Array<{
        id: string;
        size: string;
        quantity: string;
      }>;
    }>,
    // Images
    images: [] as string[],
    mainImage: '',
    // Variants
    hasVariants: false,
    variantType: '', // color, size, material, etc.
    variants: [] as any[],
    // SEO & Marketing
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    tags: [] as string[],
    // Shipping
    shippingWeight: '',
    shippingDimensions: {
      length: '',
      width: '',
      height: ''
    },
    freeShipping: false,
    shippingClass: '',
    // Tax & Legal
    taxClass: '',
    taxRate: '',
    // Inventory
    trackInventory: true,
    allowBackorders: false,
    maxOrderQuantity: '',
    minOrderQuantity: '1', // Set default min order quantity
    // Advanced
    isVirtual: false,
    isDownloadable: false,
    downloadLimit: '',
    downloadExpiry: '',
    // Form validation state
    errors: {} as Record<string, string>
  });

  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([
    'Fashion Forward',
    'TechGear Pro',
    'Home & Garden Co',
    'Sports Elite',
    'Beauty Plus',
    'Urban Style',
    'Classic Collection',
    'Premium Brands',
    'Sportswear Pro',
    'Casual Comfort'
  ]);

  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [filteredColors, setFilteredColors] = useState([
    'Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Brown', 
    'Pink', 'Purple', 'Yellow', 'Orange', 'Beige', 'Maroon', 'Teal', 
    'Cyan', 'Magenta', 'Lime', 'Olive', 'Silver', 'Gold', 'Indigo'
  ]);

  const [previews, setPreviews] = useState<{
    images: string[];
  }>({
    images: []
  });

  // Add default color block on component mount
  useEffect(() => {
    if (formData.colorBlocks.length === 0) {
      addColorBlock();
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (field === 'images') {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
          setPreviews(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setPreviews(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return value.trim() === '' ? 'Product name is required' : '';
      case 'title':
        return value.trim() === '' ? 'Product title is required' : '';
      case 'price':
        return value.trim() === '' ? 'Price is required' : 
               isNaN(Number(value)) ? 'Price must be a number' : '';
      case 'category':
        return value.trim() === '' ? 'Category is required' : '';
      case 'brand':
        return value.trim() === '' ? 'Brand is required' : '';
      case 'sku':
        return value.trim() === '' ? 'SKU is required' : '';
      case 'stockQuantity':
        return value.trim() === '' ? 'Stock quantity is required' : 
               isNaN(Number(value)) ? 'Stock quantity must be a number' : '';
      case 'quantity':
        return value.trim() === '' ? 'Quantity is required' : 
               isNaN(Number(value)) ? 'Quantity must be a number' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    const error = validateField(field, value);
    setFormData(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));
  };

  const handleBrandSearch = (searchTerm: string) => {
    setBrandSearchTerm(searchTerm);
    const allBrands = [
      'Fashion Forward',
      'TechGear Pro',
      'Home & Garden Co',
      'Sports Elite',
      'Beauty Plus',
      'Urban Style',
      'Classic Collection',
      'Premium Brands',
      'Sportswear Pro',
      'Casual Comfort'
    ];
    
    const filtered = allBrands.filter(brand => 
      brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  const handleColorSearch = (searchTerm: string) => {
    setColorSearchTerm(searchTerm);
    const allColors = [
      'Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Brown', 
      'Pink', 'Purple', 'Yellow', 'Orange', 'Beige', 'Maroon', 'Teal', 
      'Cyan', 'Magenta', 'Lime', 'Olive', 'Silver', 'Gold', 'Indigo'
    ];
    
    const filtered = allColors.filter(color => 
      color.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColors(filtered);
  };

  // Color block management functions
  const addColorBlock = () => {
    const newColorBlock = {
      id: Date.now().toString(),
      color: '',
      newColor: '',
      images: [] as File[],
      sizes: [{
        id: Date.now().toString(),
        size: '',
        quantity: ''
      }]
    };
    setFormData(prev => ({
      ...prev,
      colorBlocks: [...prev.colorBlocks, newColorBlock]
    }));
  };

  const removeColorBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.filter(block => block.id !== blockId)
    }));
  };

  const updateColorBlock = (blockId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === blockId ? { ...block, [field]: value } : block
      )
    }));
  };

  const addSizeToColorBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === blockId 
          ? { 
              ...block, 
              sizes: [...block.sizes, {
                id: Date.now().toString(),
                size: '',
                quantity: ''
              }]
            }
          : block
      )
    }));
  };

  const removeSizeFromColorBlock = (blockId: string, sizeId: string) => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === blockId 
          ? { 
              ...block, 
              sizes: block.sizes.filter(size => size.id !== sizeId)
            }
          : block
      )
    }));
  };

  const updateSizeInColorBlock = (blockId: string, sizeId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === blockId 
          ? { 
              ...block, 
              sizes: block.sizes.map(size => 
                size.id === sizeId ? { ...size, [field]: value } : size
              )
            }
          : block
      )
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - only check essential fields
    const requiredFields = ['name', 'title', 'price', 'brand'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Only show errors for essential fields
    if (Object.keys(newErrors).length > 0) {
      setFormData(prev => ({
        ...prev,
        errors: newErrors
      }));
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the data for submission
      const productData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        salePrice: formData.salePrice || undefined,
        costPrice: formData.costPrice || undefined,
        sku: formData.sku,
        barcode: formData.barcode,
        brand: formData.brand,
        status: formData.status,
        categoryLevel1: formData.categoryLevel1,
        categoryLevel2: formData.categoryLevel2,
        categoryLevel3: formData.categoryLevel3,
        categoryLevel4: formData.categoryLevel4,
        category: formData.category,
        lowStockThreshold: formData.lowStockThreshold || undefined,
        maxOrderQuantity: formData.maxOrderQuantity || undefined,
        minOrderQuantity: formData.minOrderQuantity || '1',
        downloadLimit: formData.downloadLimit || undefined,
        downloadExpiry: formData.downloadExpiry || undefined,
        taxRate: formData.taxRate || undefined,
        shippingWeight: formData.shippingWeight || undefined,
        // Ensure arrays are properly formatted
        tags: formData.tags || [],
        images: formData.images || [],
        variants: formData.variants || [],
        colorBlocks: formData.colorBlocks.map(block => ({
          id: block.id,
          color: block.color,
          newColor: block.newColor,
          images: [], // Convert File[] to empty array for now (would need file upload handling)
          sizes: block.sizes.map(size => ({
            id: size.id,
            size: size.size,
            quantity: size.quantity || '0'
          }))
        })),
        // SEO & Marketing
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        keywords: formData.keywords,
        // Shipping
        shippingDimensions: formData.shippingDimensions,
        freeShipping: formData.freeShipping,
        shippingClass: formData.shippingClass,
        // Tax & Legal
        taxClass: formData.taxClass,
        // Inventory
        trackInventory: formData.trackInventory,
        allowBackorders: formData.allowBackorders,
        // Advanced
        isVirtual: formData.isVirtual,
        isDownloadable: formData.isDownloadable,
        hasVariants: formData.hasVariants,
        variantType: formData.variantType
      };

      // Submit to API
      console.log('Sending product data to backend:', JSON.stringify(productData, null, 2));
      const response = await apiService.createProduct(productData);
      
      console.log('Product created successfully:', response);
      
      // Create detailed success message with actual inputs
      const successMessage = `Product "${formData.name}" created successfully!
      
📋 Product Details:
• Name: ${formData.name}
• Title: ${formData.title}
• Brand: ${formData.brand}
• Price: $${formData.price}
• Status: ${formData.status || 'active'}
• Category: ${formData.categoryLevel1} > ${formData.categoryLevel2} > ${formData.categoryLevel3}
• SKU: ${formData.sku || 'Auto-generated'}
• Colors: ${formData.colorBlocks.length} color(s) added
• Total Sizes: ${formData.colorBlocks.reduce((total, block) => total + block.sizes.length, 0)} size(s)`;

      toast.success(successMessage, {
        duration: 5000,
        position: "top-center",
      });
      
      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    router.push('/admin/signin');
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: Date.now(),
        name: '',
        sku: '',
        price: '',
        stockQuantity: '',
        attributes: {}
      }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  // Category data structure
  const categoryData = {
    men: {
      clothing: {
        'T-shirts': [
          { label: 'Basic T-shirts', value: 'men-clothing-tshirts-basic' },
          { label: 'Printed T-shirts', value: 'men-clothing-tshirts-printed' },
          { label: 'Tank Tops', value: 'men-clothing-tshirts-tank-tops' },
          { label: 'Long-sleeved T-shirts', value: 'men-clothing-tshirts-long-sleeved' },
          { label: 'Jerseys', value: 'men-clothing-tshirts-jerseys' }
        ],
        'Polo Shirts': [
          { label: 'Polo Shirts', value: 'men-clothing-polo-shirts' }
        ],
        'Shirts': [
          { label: 'Casual Shirts', value: 'men-clothing-shirts-casual' },
          { label: 'Business Shirts', value: 'men-clothing-shirts-business' }
        ],
        'Hoodies': [
          { label: 'Hoodies', value: 'men-clothing-hoodies' }
        ],
        'Sweatshirts': [
          { label: 'Sweatshirts', value: 'men-clothing-sweatshirts' }
        ],
        'Pants': [
          { label: 'Gabardines', value: 'men-clothing-pants-gabardines' },
          { label: 'Jeans', value: 'men-clothing-pants-jeans' },
          { label: 'Trousers', value: 'men-clothing-pants-trousers' },
          { label: 'Pajamas', value: 'men-clothing-pants-pajamas' }
        ],
        'Shorts': [
          { label: 'Shorts', value: 'men-clothing-shorts' }
        ],
        'Jackets': [
          { label: 'Jackets', value: 'men-clothing-jackets' }
        ],
        'Tracksuits': [
          { label: 'Tracksuits', value: 'men-clothing-tracksuits' }
        ],
        'Suits': [
          { label: 'Suits', value: 'men-clothing-suits' }
        ],
        'Underwear': [
          { label: 'Underwear', value: 'men-clothing-underwear' }
        ],
        'Socks': [
          { label: 'Socks', value: 'men-clothing-socks' }
        ],
        'Panjabis': [
          { label: 'Panjabis', value: 'men-clothing-panjabis' }
        ]
      },
      shoes: {
        'Sneakers': [
          { label: 'Sneakers', value: 'men-shoes-sneakers' }
        ],
        'Lace-up shoes': [
          { label: 'Lace-up shoes', value: 'men-shoes-lace-up-shoes' }
        ],
        'Loafers': [
          { label: 'Loafers', value: 'men-shoes-loafers' }
        ],
        'Business shoes': [
          { label: 'Business shoes', value: 'men-shoes-business-shoes' }
        ],
        'Boots': [
          { label: 'Boots', value: 'men-shoes-boots' }
        ],
        'Slippers': [
          { label: 'Slippers', value: 'men-shoes-slippers' }
        ]
      },
      accessories: {
        'Sunglasses': [
          { label: 'Sunglasses', value: 'men-accessories-sunglasses' }
        ],
        'Watches': [
          { label: 'Watches', value: 'men-accessories-watches' }
        ],
        'Belts': [
          { label: 'Belts', value: 'men-accessories-belts' }
        ],
        'Wallets': [
          { label: 'Wallets', value: 'men-accessories-wallets' }
        ],
        'Caps': [
          { label: 'Caps', value: 'men-accessories-caps' }
        ]
      }
    },
    women: {
      clothing: {
        'Salwar Kameez': [
          { label: 'Salwar Kameez', value: 'women-clothing-salwar-kameez' }
        ],
        'Sarees': [
          { label: 'Sarees', value: 'women-clothing-sarees' }
        ],
        'Kurtis': [
          { label: 'Kurtis', value: 'women-clothing-kurtis' }
        ],
        'Shirts': [
          { label: 'Shirts', value: 'women-clothing-shirts' }
        ],
        'T-shirts': [
          { label: 'T-shirts', value: 'women-clothing-tshirts' }
        ],
        'Tops': [
          { label: 'Tops', value: 'women-clothing-tops' }
        ],
        'Burkas': [
          { label: 'Burkas', value: 'women-clothing-burkas' }
        ],
        'Abayas': [
          { label: 'Abayas', value: 'women-clothing-abayas' }
        ],
        'Undergarments': [
          { label: 'Bras', value: 'women-clothing-undergarments-bras' },
          { label: 'Panties', value: 'women-clothing-undergarments-panties' },
          { label: '2 Piece Sets', value: 'women-clothing-undergarments-2-piece-sets' }
        ],
        'Pants': [
          { label: 'Gabardines', value: 'women-clothing-pants-gabardines' },
          { label: 'Jeans', value: 'women-clothing-pants-jeans' },
          { label: 'Palazzos', value: 'women-clothing-pants-palazzos' },
          { label: 'Leggings', value: 'women-clothing-pants-leggings' }
        ]
      },
      shoes: {
        'Slippers': [
          { label: 'Slippers', value: 'women-shoes-slippers' }
        ],
        'Heels': [
          { label: 'Heels', value: 'women-shoes-heels' }
        ],
        'Pumps': [
          { label: 'Pumps', value: 'women-shoes-pumps' }
        ],
        'Sneakers': [
          { label: 'Sneakers', value: 'women-shoes-sneakers' }
        ],
        'Sandals': [
          { label: 'Sandals', value: 'women-shoes-sandals' }
        ]
      },
      accessories: {
        'Ornas': [
          { label: 'Ornas', value: 'women-accessories-ornas' }
        ],
        'Hijabs': [
          { label: 'Hijabs', value: 'women-accessories-hijabs' }
        ],
        'Watches': [
          { label: 'Watches', value: 'women-accessories-watches' }
        ],
        'Sunglasses': [
          { label: 'Sunglasses', value: 'women-accessories-sunglasses' }
        ],
        'Bags': [
          { label: 'Bags', value: 'women-accessories-bags' }
        ],
        'Purses': [
          { label: 'Purses', value: 'women-accessories-purses' }
        ]
      }
    },
    kids: {
      clothing: {
        'Baby (0-12 months)': [
          { label: 'Onesies', value: 'kids-clothing-baby-onesies' },
          { label: 'Rompers', value: 'kids-clothing-baby-rompers' },
          { label: 'Sleep Suits', value: 'kids-clothing-baby-sleep-suits' },
          { label: 'Bibs', value: 'kids-clothing-baby-bibs' },
          { label: 'Hats', value: 'kids-clothing-baby-hats' },
          { label: 'Socks', value: 'kids-clothing-baby-socks' },
          { label: 'Mittens', value: 'kids-clothing-baby-mittens' }
        ],
        'Toddler Girls (1-3 years)': [
          { label: 'Dresses', value: 'kids-clothing-toddler-girls-dresses' },
          { label: 'T-shirts', value: 'kids-clothing-toddler-girls-tshirts' },
          { label: 'Tops', value: 'kids-clothing-toddler-girls-tops' },
          { label: 'Skirts', value: 'kids-clothing-toddler-girls-skirts' },
          { label: 'Pants', value: 'kids-clothing-toddler-girls-pants' },
          { label: 'Shorts', value: 'kids-clothing-toddler-girls-shorts' },
          { label: 'Jackets', value: 'kids-clothing-toddler-girls-jackets' },
          { label: 'Pajamas', value: 'kids-clothing-toddler-girls-pajamas' },
          { label: 'Underwear', value: 'kids-clothing-toddler-girls-underwear' }
        ],
        'Toddler Boys (1-3 years)': [
          { label: 'T-shirts', value: 'kids-clothing-toddler-boys-tshirts' },
          { label: 'Shirts', value: 'kids-clothing-toddler-boys-shirts' },
          { label: 'Pants', value: 'kids-clothing-toddler-boys-pants' },
          { label: 'Shorts', value: 'kids-clothing-toddler-boys-shorts' },
          { label: 'Jackets', value: 'kids-clothing-toddler-boys-jackets' },
          { label: 'Hoodies', value: 'kids-clothing-toddler-boys-hoodies' },
          { label: 'Pajamas', value: 'kids-clothing-toddler-boys-pajamas' },
          { label: 'Underwear', value: 'kids-clothing-toddler-boys-underwear' }
        ],
        'Kid Girls (3-6 years)': [
          { label: 'Dresses', value: 'kids-clothing-kid-girls-dresses' },
          { label: 'T-shirts', value: 'kids-clothing-kid-girls-tshirts' },
          { label: 'Tops', value: 'kids-clothing-kid-girls-tops' },
          { label: 'Skirts', value: 'kids-clothing-kid-girls-skirts' },
          { label: 'Pants', value: 'kids-clothing-kid-girls-pants' },
          { label: 'Shorts', value: 'kids-clothing-kid-girls-shorts' },
          { label: 'Jackets', value: 'kids-clothing-kid-girls-jackets' },
          { label: 'Hoodies', value: 'kids-clothing-kid-girls-hoodies' },
          { label: 'Pajamas', value: 'kids-clothing-kid-girls-pajamas' },
          { label: 'Underwear', value: 'kids-clothing-kid-girls-underwear' }
        ],
        'Kid Boys (3-6 years)': [
          { label: 'T-shirts', value: 'kids-clothing-kid-boys-tshirts' },
          { label: 'Shirts', value: 'kids-clothing-kid-boys-shirts' },
          { label: 'Pants', value: 'kids-clothing-kid-boys-pants' },
          { label: 'Shorts', value: 'kids-clothing-kid-boys-shorts' },
          { label: 'Jackets', value: 'kids-clothing-kid-boys-jackets' },
          { label: 'Hoodies', value: 'kids-clothing-kid-boys-hoodies' },
          { label: 'Pajamas', value: 'kids-clothing-kid-boys-pajamas' },
          { label: 'Underwear', value: 'kids-clothing-kid-boys-underwear' }
        ],
        'Teen Girls (9-16 years)': [
          { label: 'Dresses', value: 'kids-clothing-teen-girls-dresses' },
          { label: 'T-shirts', value: 'kids-clothing-teen-girls-tshirts' },
          { label: 'Tops', value: 'kids-clothing-teen-girls-tops' },
          { label: 'Skirts', value: 'kids-clothing-teen-girls-skirts' },
          { label: 'Pants', value: 'kids-clothing-teen-girls-pants' },
          { label: 'Jeans', value: 'kids-clothing-teen-girls-jeans' },
          { label: 'Shorts', value: 'kids-clothing-teen-girls-shorts' },
          { label: 'Jackets', value: 'kids-clothing-teen-girls-jackets' },
          { label: 'Hoodies', value: 'kids-clothing-teen-girls-hoodies' },
          { label: 'Activewear', value: 'kids-clothing-teen-girls-activewear' }
        ],
        'Teen Boys (9-16 years)': [
          { label: 'T-shirts', value: 'kids-clothing-teen-boys-tshirts' },
          { label: 'Shirts', value: 'kids-clothing-teen-boys-shirts' },
          { label: 'Pants', value: 'kids-clothing-teen-boys-pants' },
          { label: 'Jeans', value: 'kids-clothing-teen-boys-jeans' },
          { label: 'Shorts', value: 'kids-clothing-teen-boys-shorts' },
          { label: 'Jackets', value: 'kids-clothing-teen-boys-jackets' },
          { label: 'Hoodies', value: 'kids-clothing-teen-boys-hoodies' },
          { label: 'Activewear', value: 'kids-clothing-teen-boys-activewear' },
          { label: 'Polo Shirts', value: 'kids-clothing-teen-boys-polo-shirts' }
        ]
      },
      shoes: {
        'Baby (0-12 months)': [
          { label: 'Soft Sole Shoes', value: 'kids-shoes-baby-soft-sole' },
          { label: 'Booties', value: 'kids-shoes-baby-booties' },
          { label: 'Socks with Grips', value: 'kids-shoes-baby-grip-socks' }
        ],
        'Toddler Girls (1-3 years)': [
          { label: 'First Walker Shoes', value: 'kids-shoes-toddler-girls-first-walker' },
          { label: 'Sandals', value: 'kids-shoes-toddler-girls-sandals' },
          { label: 'Sneakers', value: 'kids-shoes-toddler-girls-sneakers' },
          { label: 'Mary Janes', value: 'kids-shoes-toddler-girls-mary-janes' },
          { label: 'Boots', value: 'kids-shoes-toddler-girls-boots' }
        ],
        'Toddler Boys (1-3 years)': [
          { label: 'First Walker Shoes', value: 'kids-shoes-toddler-boys-first-walker' },
          { label: 'Sandals', value: 'kids-shoes-toddler-boys-sandals' },
          { label: 'Sneakers', value: 'kids-shoes-toddler-boys-sneakers' },
          { label: 'Boots', value: 'kids-shoes-toddler-boys-boots' }
        ],
        'Kid Girls (3-6 years)': [
          { label: 'Sneakers', value: 'kids-shoes-kid-girls-sneakers' },
          { label: 'School Shoes', value: 'kids-shoes-kid-girls-school-shoes' },
          { label: 'Sandals', value: 'kids-shoes-kid-girls-sandals' },
          { label: 'Ballet Flats', value: 'kids-shoes-kid-girls-ballet-flats' },
          { label: 'Boots', value: 'kids-shoes-kid-girls-boots' }
        ],
        'Kid Boys (3-6 years)': [
          { label: 'Sneakers', value: 'kids-shoes-kid-boys-sneakers' },
          { label: 'School Shoes', value: 'kids-shoes-kid-boys-school-shoes' },
          { label: 'Sandals', value: 'kids-shoes-kid-boys-sandals' },
          { label: 'Boots', value: 'kids-shoes-kid-boys-boots' }
        ],
        'Teen Girls (9-16 years)': [
          { label: 'Sneakers', value: 'kids-shoes-teen-girls-sneakers' },
          { label: 'School Shoes', value: 'kids-shoes-teen-girls-school-shoes' },
          { label: 'Casual Shoes', value: 'kids-shoes-teen-girls-casual' },
          { label: 'Boots', value: 'kids-shoes-teen-girls-boots' },
          { label: 'Sandals', value: 'kids-shoes-teen-girls-sandals' }
        ],
        'Teen Boys (9-16 years)': [
          { label: 'Sneakers', value: 'kids-shoes-teen-boys-sneakers' },
          { label: 'School Shoes', value: 'kids-shoes-teen-boys-school-shoes' },
          { label: 'Casual Shoes', value: 'kids-shoes-teen-boys-casual' },
          { label: 'Boots', value: 'kids-shoes-teen-boys-boots' },
          { label: 'Sports Shoes', value: 'kids-shoes-teen-boys-sports' }
        ]
      },
      accessories: {
        'Baby (0-12 months)': [
          { label: 'Hats', value: 'kids-accessories-baby-hats' },
          { label: 'Bibs', value: 'kids-accessories-baby-bibs' },
          { label: 'Mittens', value: 'kids-accessories-baby-mittens' },
          { label: 'Blankets', value: 'kids-accessories-baby-blankets' }
        ],
        'Toddler Girls (1-3 years)': [
          { label: 'Hair Accessories', value: 'kids-accessories-toddler-girls-hair' },
          { label: 'Small Bags', value: 'kids-accessories-toddler-girls-bags' },
          { label: 'Hats', value: 'kids-accessories-toddler-girls-hats' },
          { label: 'Jewelry', value: 'kids-accessories-toddler-girls-jewelry' }
        ],
        'Toddler Boys (1-3 years)': [
          { label: 'Caps', value: 'kids-accessories-toddler-boys-caps' },
          { label: 'Small Bags', value: 'kids-accessories-toddler-boys-bags' },
          { label: 'Watches', value: 'kids-accessories-toddler-boys-watches' }
        ],
        'Kid Girls (3-6 years)': [
          { label: 'Hair Accessories', value: 'kids-accessories-kid-girls-hair' },
          { label: 'Backpacks', value: 'kids-accessories-kid-girls-backpacks' },
          { label: 'Watches', value: 'kids-accessories-kid-girls-watches' },
          { label: 'Jewelry', value: 'kids-accessories-kid-girls-jewelry' },
          { label: 'Belts', value: 'kids-accessories-kid-girls-belts' }
        ],
        'Kid Boys (3-6 years)': [
          { label: 'Caps', value: 'kids-accessories-kid-boys-caps' },
          { label: 'Backpacks', value: 'kids-accessories-kid-boys-backpacks' },
          { label: 'Watches', value: 'kids-accessories-kid-boys-watches' },
          { label: 'Belts', value: 'kids-accessories-kid-boys-belts' }
        ],
        'Teen Girls (9-16 years)': [
          { label: 'Hair Accessories', value: 'kids-accessories-teen-girls-hair' },
          { label: 'Backpacks', value: 'kids-accessories-teen-girls-backpacks' },
          { label: 'Purses', value: 'kids-accessories-teen-girls-purses' },
          { label: 'Watches', value: 'kids-accessories-teen-girls-watches' },
          { label: 'Jewelry', value: 'kids-accessories-teen-girls-jewelry' },
          { label: 'Sunglasses', value: 'kids-accessories-teen-girls-sunglasses' }
        ],
        'Teen Boys (9-16 years)': [
          { label: 'Caps', value: 'kids-accessories-teen-boys-caps' },
          { label: 'Backpacks', value: 'kids-accessories-teen-boys-backpacks' },
          { label: 'Watches', value: 'kids-accessories-teen-boys-watches' },
          { label: 'Belts', value: 'kids-accessories-teen-boys-belts' },
          { label: 'Sunglasses', value: 'kids-accessories-teen-boys-sunglasses' }
        ]
      }
    }
  };

  // Helper functions for cascading dropdowns
  const handleCategoryLevel1Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryLevel1: value,
      categoryLevel2: '',
      categoryLevel3: '',
      categoryLevel4: '',
      category: ''
    }));
  };

  const handleCategoryLevel2Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryLevel2: value,
      categoryLevel3: '',
      categoryLevel4: '',
      category: ''
    }));
  };

  const handleCategoryLevel3Change = (value: string) => {
    const subCategories = (categoryData[formData.categoryLevel1 as keyof typeof categoryData]?.[formData.categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] as any)?.[value];
    
    // Check if there are real sub-categories (not just a single dummy entry)
    let hasRealSubCategories = false;
    let finalCategoryValue = '';
    
    if (!subCategories || subCategories.length === 0) {
      // No sub-categories at all
      hasRealSubCategories = false;
      finalCategoryValue = `${formData.categoryLevel1}-${formData.categoryLevel2}-${value}`;
    } else if (subCategories.length === 1 && subCategories[0].label.toLowerCase() === value.toLowerCase()) {
      // Only one sub-category with same name as parent - use its value
      hasRealSubCategories = false;
      finalCategoryValue = subCategories[0].value;
    } else {
      // Multiple sub-categories or different names - real sub-categories exist
      hasRealSubCategories = true;
      finalCategoryValue = '';
    }
    
    setFormData(prev => ({
      ...prev,
      categoryLevel3: value,
      categoryLevel4: '',
      category: finalCategoryValue
    }));
  };

  const handleCategoryLevel4Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryLevel4: value,
      category: value
    }));
  };

  // Helper function to check if fourth level categories exist
  const hasFourthLevelCategories = () => {
    if (!formData.categoryLevel1 || !formData.categoryLevel2 || !formData.categoryLevel3) {
      return false;
    }
    const subCategories = (categoryData[formData.categoryLevel1 as keyof typeof categoryData]?.[formData.categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] as any)?.[formData.categoryLevel3];
    
    // If no sub-categories exist, return false
    if (!subCategories || subCategories.length === 0) {
      return false;
    }
    
    // If there's only one sub-category and it has the same name as the parent category,
    // treat it as "no real sub-categories" (just the final category itself)
    if (subCategories.length === 1 && 
        subCategories[0].label.toLowerCase() === formData.categoryLevel3.toLowerCase()) {
      return false;
    }
    
    return true;
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
                onClick={() => router.push('/admin/products')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600">Create a new product in your catalog</p>
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
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
            {/* Single Combined Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Add New Product</CardTitle>
                    <CardDescription>Create a new product in your catalog with all necessary details</CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Status: *</span>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className={`w-40 font-medium ${
                        formData.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' 
                          : formData.status === 'inactive'
                          ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'
                      }`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active" className="text-green-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Active</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive" className="text-red-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Inactive</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="draft" className="text-yellow-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Draft</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Package className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="brand" className="block mb-2 text-sm font-medium">Brand *</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                        <SelectTrigger className={`h-10 w-full ${formData.errors.brand ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Search and select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search brands..."
                              value={brandSearchTerm}
                              onChange={(e) => handleBrandSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {filteredBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                          {filteredBrands.length === 0 && (
                            <div className="px-2 py-1 text-sm text-gray-500">
                              No brands found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {formData.errors.brand && (
                        <p className="text-red-500 text-sm mt-1">{formData.errors.brand}</p>
                      )}
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="name" className="block mb-2 text-sm font-medium">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        className={`h-10 w-full ${formData.errors.name ? 'border-red-500' : ''}`}
                      />
                      {formData.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{formData.errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="sku" className="block mb-2 text-sm font-medium">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Enter SKU"
                        className={`h-10 w-full ${formData.errors.sku ? 'border-red-500' : ''}`}
                      />
                      {formData.errors.sku && (
                        <p className="text-red-500 text-sm mt-1">{formData.errors.sku}</p>
                      )}
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="title" className="block mb-2 text-sm font-medium">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter product title"
                        className={`h-10 w-full ${formData.errors.title ? 'border-red-500' : ''}`}
                      />
                      {formData.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{formData.errors.title}</p>
                      )}
                    </div>
                  </div>



                  <div>
                    <Label htmlFor="description" className="block mb-2">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="w-full">
                      <Label htmlFor="price" className="block mb-2 text-sm font-medium">Base Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        className={`h-10 w-full ${formData.errors.price ? 'border-red-500' : ''}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">Default price for all variants</p>
                      {formData.errors.price && (
                        <p className="text-red-500 text-sm mt-1">{formData.errors.price}</p>
                      )}
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="salePrice" className="block mb-2 text-sm font-medium">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="0.00"
                        className="h-10 w-full"
                      />
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="costPrice" className="block mb-2 text-sm font-medium">Cost Price</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange('costPrice', e.target.value)}
                        placeholder="0.00"
                        className="h-10 w-full"
                      />
                    </div>
                  </div>

                  <div className={`grid ${hasFourthLevelCategories() ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
                    <div className="w-full">
                      <Label htmlFor="categoryLevel1" className="block mb-2 text-sm font-medium">Target Audience *</Label>
                      <Select value={formData.categoryLevel1} onValueChange={handleCategoryLevel1Change}>
                        <SelectTrigger className={`h-10 w-full ${formData.errors.category ? 'border-red-500' : ''}`}>
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
                      <Label htmlFor="categoryLevel2" className="block mb-2 text-sm font-medium">Category Type *</Label>
                      <Select 
                        value={formData.categoryLevel2} 
                        onValueChange={handleCategoryLevel2Change}
                        disabled={!formData.categoryLevel1}
                      >
                        <SelectTrigger className={`h-10 w-full ${formData.errors.category ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select category type" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.categoryLevel1 && (
                            <>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="shoes">Shoes</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full">
                      <Label htmlFor="categoryLevel3" className="block mb-2 text-sm font-medium">
                        {formData.categoryLevel1 === 'kids' ? 'Age *' : 'Category Sub-Type *'}
                      </Label>
                      <Select 
                        value={formData.categoryLevel3} 
                        onValueChange={handleCategoryLevel3Change}
                        disabled={!formData.categoryLevel2}
                      >
                        <SelectTrigger className={`h-10 w-full ${formData.errors.category ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder={formData.categoryLevel1 === 'kids' ? 'Select age group' : 'Select sub-category'} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.categoryLevel1 && formData.categoryLevel2 && 
                            Object.keys(categoryData[formData.categoryLevel1 as keyof typeof categoryData]?.[formData.categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] || {}).map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Only show fourth dropdown if sub-categories exist */}
                    {hasFourthLevelCategories() && (
                      <div className="w-full">
                        <Label htmlFor="categoryLevel4" className="block mb-2 text-sm font-medium">Specific Item *</Label>
                        <Select 
                          value={formData.categoryLevel4} 
                          onValueChange={handleCategoryLevel4Change}
                          disabled={!formData.categoryLevel3}
                        >
                          <SelectTrigger className={`h-10 w-full ${formData.errors.category ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select specific item" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.categoryLevel1 && formData.categoryLevel2 && formData.categoryLevel3 && 
                              (categoryData[formData.categoryLevel1 as keyof typeof categoryData]?.[formData.categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] as any)?.[formData.categoryLevel3]?.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {formData.errors.category && (
                    <p className="text-red-500 text-sm mt-1">{formData.errors.category}</p>
                  )}





                  <div className="w-full">
                    <Label htmlFor="barcode" className="block mb-2 text-sm font-medium">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="Enter barcode"
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                {/* Inventory & Stock Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Hash className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-semibold">Inventory & Stock</h3>
                  </div>

                  {/* Color Blocks */}
                  <div className="space-y-4">
                    {formData.colorBlocks.map((colorBlock) => (
                      <div key={colorBlock.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-semibold text-gray-900 text-lg">Color</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeColorBlock(colorBlock.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {/* Color Selection */}
                          <div className="w-full">
                            <Label className="block mb-2 text-sm font-medium">Choose Color *</Label>
                            <Select 
                              value={colorBlock.color} 
                              onValueChange={(value) => updateColorBlock(colorBlock.id, 'color', value)}
                            >
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="Search and select color" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Search colors..."
                                    value={colorSearchTerm}
                                    onChange={(e) => handleColorSearch(e.target.value)}
                                    className="mb-2"
                                  />
                                </div>
                                {filteredColors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ))}
                                {filteredColors.length === 0 && (
                                  <div className="px-2 py-1 text-sm text-gray-500">
                                    No colors found
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Add New Color */}
                          <div className="w-full">
                            <Label className="block mb-2 text-sm font-medium">Or enter a new color</Label>
                            <Input
                              value={colorBlock.newColor}
                              onChange={(e) => updateColorBlock(colorBlock.id, 'newColor', e.target.value)}
                              placeholder="Enter new color name"
                              className="h-10 w-full"
                            />
                          </div>
                        </div>



                        {/* Image Upload */}
                        <div className="mb-6">
                          <Label className="block mb-2 text-sm font-medium">Upload Images *</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="w-full">
                              <input
                                type="file"
                                id={`file-upload-${colorBlock.id}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  if (file) {
                                    // Handle file upload for this specific color block
                                    console.log('File uploaded for color block:', colorBlock.id, file);
                                  }
                                }}
                                accept="image/*"
                                multiple
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const fileInput = document.getElementById(`file-upload-${colorBlock.id}`) as HTMLInputElement;
                                  fileInput?.click();
                                }}
                                className="border-gray-300 hover:bg-gray-50 h-10 w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Files
                              </Button>
                            </div>
                            
                            <div className="w-full">
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Enter image URL"
                                  className="h-10 flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const input = e.target as HTMLInputElement;
                                      if (input.value.trim()) {
                                        // Handle image URL addition for this color block
                                        input.value = '';
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    if (input.value.trim()) {
                                      // Handle image URL addition for this color block
                                      input.value = '';
                                    }
                                  }}
                                  className="h-10"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sizes + Stock */}
                        <div>
                          <Label className="block mb-2 text-sm font-medium">Sizes + Stock *</Label>
                          <div className="space-y-3">
                            {colorBlock.sizes.map((size) => (
                              <div key={size.id} className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <Select 
                                    value={size.size} 
                                    onValueChange={(value) => updateSizeInColorBlock(colorBlock.id, size.id, 'size', value)}
                                  >
                                    <SelectTrigger className="h-10 w-full">
                                      <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="xs">XS</SelectItem>
                                      <SelectItem value="s">S</SelectItem>
                                      <SelectItem value="m">M</SelectItem>
                                      <SelectItem value="l">L</SelectItem>
                                      <SelectItem value="xl">XL</SelectItem>
                                      <SelectItem value="xxl">XXL</SelectItem>
                                      <SelectItem value="xxxl">XXXL</SelectItem>
                                      <SelectItem value="2t">2T</SelectItem>
                                      <SelectItem value="3t">3T</SelectItem>
                                      <SelectItem value="4t">4T</SelectItem>
                                      <SelectItem value="5t">5T</SelectItem>
                                      <SelectItem value="6t">6T</SelectItem>
                                      <SelectItem value="7">7</SelectItem>
                                      <SelectItem value="8">8</SelectItem>
                                      <SelectItem value="9">9</SelectItem>
                                      <SelectItem value="10">10</SelectItem>
                                      <SelectItem value="11">11</SelectItem>
                                      <SelectItem value="12">12</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    value={size.quantity}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'quantity', e.target.value)}
                                    placeholder="Enter quantity"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    value={formData.lowStockThreshold}
                                    onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                                    placeholder="Enter low quantity threshold"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeSizeFromColorBlock(colorBlock.id, size.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white h-10 w-10 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSizeToColorBlock(colorBlock.id)}
                              className="w-full h-10"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Size
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Color Block Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addColorBlock}
                      className="w-full border-2 border-dashed border-gray-400 hover:border-gray-500 hover:bg-gray-100 text-gray-700 hover:text-gray-800 py-6"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Color Block
                    </Button>
                  </div>
                </div>





                {/* Advanced Options Section */}
                <div className="space-y-4">
                  <div 
                    className="flex items-center justify-between pb-2 border-b border-gray-200 cursor-pointer"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <h3 className="text-sm font-semibold">Advanced Options</h3>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-600 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                    />
                  </div>
                  
                  {showAdvancedOptions && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                          <Label htmlFor="metaTitle" className="block mb-2 text-sm font-medium">SEO Title</Label>
                          <Input
                            id="metaTitle"
                            value={formData.metaTitle}
                            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                            placeholder="SEO optimized title"
                            className="h-10 w-full"
                          />
                        </div>
                        
                        <div className="w-full">
                          <Label htmlFor="metaDescription" className="block mb-2 text-sm font-medium">SEO Description</Label>
                          <Input
                            id="metaDescription"
                            value={formData.metaDescription}
                            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                            placeholder="SEO description"
                            className="h-10 w-full"
                          />
                        </div>
                      </div>

                      <div className="w-full">
                        <Label htmlFor="keywords" className="block mb-2 text-sm font-medium">Keywords</Label>
                        <Input
                          id="keywords"
                          value={formData.keywords}
                          onChange={(e) => handleInputChange('keywords', e.target.value)}
                          placeholder="keyword1, keyword2, keyword3"
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                          <Label htmlFor="shippingWeight" className="block mb-2 text-sm font-medium">Shipping Weight (kg)</Label>
                          <Input
                            id="shippingWeight"
                            type="number"
                            step="0.01"
                            value={formData.shippingWeight}
                            onChange={(e) => handleInputChange('shippingWeight', e.target.value)}
                            placeholder="0.00"
                            className="h-10 w-full"
                          />
                        </div>
                        
                        <div className="w-full">
                          <Label htmlFor="shippingClass" className="block mb-2 text-sm font-medium">Shipping Class</Label>
                          <Select value={formData.shippingClass} onValueChange={(value) => handleInputChange('shippingClass', value)}>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Select shipping class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="overnight">Overnight</SelectItem>
                              <SelectItem value="free">Free Shipping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                          <Label htmlFor="taxClass" className="block mb-2 text-sm font-medium">Tax Class</Label>
                          <Select value={formData.taxClass} onValueChange={(value) => handleInputChange('taxClass', value)}>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Select tax class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Rate</SelectItem>
                              <SelectItem value="reduced">Reduced Rate</SelectItem>
                              <SelectItem value="zero">Zero Rate</SelectItem>
                              <SelectItem value="exempt">Exempt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="w-full">
                          <Label htmlFor="taxRate" className="block mb-2 text-sm font-medium">Tax Rate (%)</Label>
                          <Input
                            id="taxRate"
                            type="number"
                            step="0.01"
                            value={formData.taxRate}
                            onChange={(e) => handleInputChange('taxRate', e.target.value)}
                            placeholder="0.00"
                            className="h-10 w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                          <Label htmlFor="maxOrderQuantity" className="block mb-2 text-sm font-medium">Max Order Quantity</Label>
                          <Input
                            id="maxOrderQuantity"
                            type="number"
                            value={formData.maxOrderQuantity}
                            onChange={(e) => handleInputChange('maxOrderQuantity', e.target.value)}
                            placeholder="No limit"
                            className="h-10 w-full"
                          />
                        </div>
                        
                        <div className="w-full">
                          <Label htmlFor="minOrderQuantity" className="block mb-2 text-sm font-medium">Min Order Quantity</Label>
                          <Input
                            id="minOrderQuantity"
                            type="number"
                            value={formData.minOrderQuantity}
                            onChange={(e) => handleInputChange('minOrderQuantity', e.target.value)}
                            placeholder="1"
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
                className="px-6"
              >
                Cancel
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Save as draft
                    toast.info('Draft saving feature coming soon!');
                  }}
                  className="px-6"
                >
                  Save as Draft
                </Button>
                
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSubmitting}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Creating Product...' : 'Create Product'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}