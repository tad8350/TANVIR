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
  Image, Palette, Ruler, Hash, Trash2, Star, RefreshCw, Info
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
import { adminLogout, requireAdminAuth } from "@/lib/admin-auth";

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
    // Color blocks - restructured for size-level pricing
    colorBlocks: [] as Array<{
      id: string;
      color: string;
      newColor: string;
      images: (File | string)[];
      // Removed color-level pricing - now handled at size level
      sizes: Array<{
        id: string;
        size: string;
        quantity: string;
        lowStockThreshold: string;
        // Pricing moved to size level
        basePrice: string;
        salePrice: string;
        costPrice: string;
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
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

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

  // Add state for color block image previews
  const [colorBlockPreviews, setColorBlockPreviews] = useState<{
    [colorBlockId: string]: Array<{
      file: File | null;
      preview: string;
    }>;
  }>({});

  // Add default color block on component mount
  useEffect(() => {
    if (formData.colorBlocks.length === 0) {
      addColorBlock();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Check authentication on component mount
  useEffect(() => {
    requireAdminAuth(router);
  }, [router]);

  // Load brands from database on component mount
  useEffect(() => {
    loadBrandsFromDatabase();
  }, []);

  // Function to load brands from database
  const loadBrandsFromDatabase = async () => {
    try {
      setBrandsLoading(true);
      const response = await apiService.getBrands(1, 100); // Get up to 100 brands
      
      if (response && response.data && Array.isArray(response.data)) {
        // Extract brand names from the response
        const brandNames = response.data.map((brand: any) => brand.brand_name || brand.name || '');
        const validBrandNames = brandNames.filter(name => name && name.trim() !== '');
        
        setAllBrands(validBrandNames);
        setFilteredBrands(validBrandNames);
        console.log('Loaded brands from database:', validBrandNames);
        
        if (validBrandNames.length > 0) {
          toast.success(`Successfully loaded ${validBrandNames.length} brand(s) from database`);
        }
              } else {
          console.error('Invalid brands response format:', response);
          setAllBrands([]);
          setFilteredBrands([]);
          toast.warning('No brands found in database. Please create some brands first.');
        }
    } catch (error) {
      console.error('Error loading brands:', error);
      setAllBrands([]);
      setFilteredBrands([]);
      toast.error('Failed to load brands from database');
    } finally {
      setBrandsLoading(false);
    }
  };

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
    
    if (!searchTerm.trim()) {
      setFilteredBrands(allBrands);
      return;
    }
    
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
        quantity: '',
        lowStockThreshold: '',
        basePrice: '',
        salePrice: '',
        costPrice: ''
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
                quantity: '',
                lowStockThreshold: '',
                basePrice: '',
                salePrice: '',
                costPrice: ''
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

  // Handle color block image upload (creates previews, doesn't upload to Cloudinary yet)
  const handleColorBlockImageUpload = (colorBlockId: string, files: File[]) => {
    console.log(`Uploading ${files.length} files for color block ${colorBlockId}:`, files);
    
    const newImages: Array<{ file: File; preview: string }> = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          newImages.push({ file, preview });
          
          // Update state when all files are processed
          if (newImages.length === files.length) {
            console.log('All files processed, updating state with previews:', newImages);
            
            setColorBlockPreviews(prev => ({
              ...prev,
              [colorBlockId]: [...(prev[colorBlockId] || []), ...newImages]
            }));
            
            // Also update the form data to store the files
            setFormData(prev => ({
              ...prev,
              colorBlocks: prev.colorBlocks.map(block => 
                block.id === colorBlockId 
                  ? { ...block, images: [...(block.images || []), ...files] }
                  : block
              )
            }));
            
            toast.success(`${files.length} image(s) added to this color block`);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(`${file.name} is not an image file`);
      }
    });
  };

  // Handle adding image URL to color block
  const handleColorBlockImageUrlAdd = (colorBlockId: string, url: string) => {
    // Create a preview for the URL
    setColorBlockPreviews(prev => ({
      ...prev,
      [colorBlockId]: [...(prev[colorBlockId] || []), { file: null, preview: url }]
    }));
    
    // Store the URL in form data
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === colorBlockId 
          ? { ...block, images: [...(block.images || []), url] }
          : block
      )
    }));
  };

  // Remove image from color block
  const removeColorBlockImage = (colorBlockId: string, imageIndex: number) => {
    setColorBlockPreviews(prev => ({
      ...prev,
      [colorBlockId]: prev[colorBlockId]?.filter((_, index) => index !== imageIndex) || []
    }));
    
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => 
        block.id === colorBlockId 
          ? { 
              ...block, 
              images: block.images?.filter((_, index) => index !== imageIndex) || []
            }
          : block
      )
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - only check essential fields
    const requiredFields = ['name', 'title', 'brand'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate that each size within each color block has a base price
    formData.colorBlocks.forEach((block, blockIndex) => {
      block.sizes.forEach((size, sizeIndex) => {
        if (!size.basePrice || size.basePrice.trim() === '') {
          newErrors[`colorBlock${blockIndex}Size${sizeIndex}Price`] = `Base price is required for ${block.color || 'color'} - ${size.size || 'size'}`;
        }
      });
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
      
      // Upload images to Cloudinary first
      toast.info('Uploading images to Cloudinary...');
      console.log('Starting Cloudinary upload for all color blocks...');
      
      const updatedColorBlocks = await Promise.all(
        formData.colorBlocks.map(async (block) => {
          console.log(`Processing color block ${block.id} (${block.color}) with ${block.images.length} images`);
          const uploadedImages: string[] = [];
          
          // Upload each image file to Cloudinary
          for (const image of block.images) {
            if (image instanceof File) {
              try {
                console.log(`Uploading file to Cloudinary: ${image.name} (${image.size} bytes)`);
                // Import the upload function dynamically to avoid issues
                const { uploadProductImage } = await import('@/lib/cloudinary');
                const result = await uploadProductImage(image);
                uploadedImages.push(result.secure_url);
                console.log(`Successfully uploaded to Cloudinary: ${result.secure_url}`);
                toast.success(`Image uploaded: ${image.name}`);
              } catch (error) {
                console.error('Error uploading image:', error);
                toast.error(`Failed to upload ${image.name}`);
              }
            } else if (typeof image === 'string') {
              // It's already a URL, keep it
              console.log(`Keeping existing URL: ${image}`);
              uploadedImages.push(image);
            }
          }
          
          console.log(`Color block ${block.id} completed with ${uploadedImages.length} images`);
          return {
            ...block,
            images: uploadedImages
          };
        })
      );
      
      // Prepare the data for submission with uploaded image URLs
      // Note: Images are only sent through colorBlocks to avoid duplication
      const productData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
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
        images: [], // Empty array - images are handled through colorBlocks only
        variants: formData.variants || [],
        colorBlocks: updatedColorBlocks.map(block => ({
          id: block.id,
          color: block.color,
          newColor: block.newColor,
          images: block.images || [], // Now contains Cloudinary URLs
          sizes: block.sizes.map(size => ({
            id: size.id,
            size: size.size,
            quantity: size.quantity || '0',
            lowStockThreshold: size.lowStockThreshold || '0',
            basePrice: size.basePrice || '0.00',
            salePrice: size.salePrice || '0.00',
            costPrice: size.costPrice || '0.00'
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
      console.log('Category data being sent:', {
        categoryLevel1: productData.categoryLevel1,
        categoryLevel2: productData.categoryLevel2,
        categoryLevel3: productData.categoryLevel3,
        categoryLevel4: productData.categoryLevel4,
        category: productData.category
      });
      
      // Debug: Log image data being sent
      console.log('Image data being sent to backend:');
      console.log('- Main images array (empty to avoid duplication):', productData.images);
      console.log('- Color blocks with images:', productData.colorBlocks.map(block => ({
        color: block.color,
        imageCount: block.images?.length || 0,
        images: block.images
      })));
      
      // Additional debugging for form data
      console.log('Form data color blocks before processing:', formData.colorBlocks.map(block => ({
        color: block.color,
        imageCount: block.images?.length || 0,
        imageTypes: block.images?.map(img => typeof img)
      })));
      
      console.log('Updated color blocks after Cloudinary upload:', updatedColorBlocks.map(block => ({
        color: block.color,
        imageCount: block.images?.length || 0,
        imageTypes: block.images?.map(img => typeof img),
        sampleImages: block.images?.slice(0, 2) // Show first 2 images
      })));
      
      console.log('Sending product data to backend:', JSON.stringify(productData, null, 2));
      const response = await apiService.createProduct(productData);
      
      console.log('Product created successfully:', response);
      
      // Create detailed success message with actual inputs
      const successMessage = `Product "${formData.name}" created successfully!
      
📋 Product Details:
• Name: ${formData.name}
• Title: ${formData.title}
• Brand: ${formData.brand}
• Status: ${formData.status || 'active'}
• Category: ${formData.categoryLevel1} > ${formData.categoryLevel2} > ${formData.categoryLevel3}
• SKU: ${formData.sku || 'Auto-generated'}
• Colors: ${formData.colorBlocks.length} color(s) added
• Total Sizes: ${formData.colorBlocks.reduce((total, block) => total + block.sizes.length, 0)} size(s)
• Pricing: Size-level pricing enabled - each size can have different prices`;

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
    adminLogout(router);
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
    // Clear all sizes when gender changes
    clearAllSizes();
  };

  const handleCategoryLevel2Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryLevel2: value,
      categoryLevel3: '',
      categoryLevel4: '',
      category: ''
    }));
    // Clear all sizes when category type changes
    clearAllSizes();
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
      categoryLevel4: '', // Reset to empty string
      category: finalCategoryValue
    }));
  };

  const handleCategoryLevel4Change = (value: string) => {
    // Find the selected sub-category to get its proper value
    const subCategories = (categoryData[formData.categoryLevel1 as keyof typeof categoryData]?.[formData.categoryLevel2 as keyof typeof categoryData[keyof typeof categoryData]] as any)?.[formData.categoryLevel3];
    const selectedSubCategory = subCategories?.find((item: any) => item.label === value);
    
    console.log('Category Level 4 Change:', {
      selectedLabel: value,
      selectedValue: selectedSubCategory?.value,
      allSubCategories: subCategories
    });
    
    setFormData(prev => ({
      ...prev,
      categoryLevel4: value, // Store the label (e.g., "Jeans")
      category: selectedSubCategory ? selectedSubCategory.value : value // Store the value (e.g., "men-clothing-pants-jeans")
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
    
    // For men's pants, we have multiple real sub-categories (Gabardines, Jeans, Trousers, Pajamas)
    // So this should return true
    return true;
  };

  // Function to get size chart based on selected category
  const getSizeChartForCategory = () => {
    if (!formData.categoryLevel1 || !formData.categoryLevel2) {
      return [];
    }

    const gender = formData.categoryLevel1;
    const categoryType = formData.categoryLevel2;
    const subCategory = formData.categoryLevel3;

    // MEN category size charts - Smart sizing
    if (gender === 'men') {
      if (categoryType === 'shoes') {
        return ['39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];
      } else if (categoryType === 'clothing') {
        // Smart sizing based on specific clothing type
        if (subCategory === 'Business Shirts' || subCategory === 'Suits') {
          return ['15', '15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', '19.5', '20', 'S', 'M', 'L', 'XL', 'XXL'];
        } else if (subCategory === 'Panjabis') {
          return ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        } else if (subCategory === 'Pants' || subCategory === 'Gabardines' || subCategory === 'Jeans' || subCategory === 'Trousers' || subCategory === 'Shorts') {
          return ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        } else if (subCategory === 'Underwear') {
          return ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        } else if (subCategory === 'Socks') {
          return ['7', '8', '9', '10', '11', '12', '13', '14'];
        } else if (subCategory === 'Pajamas') {
          return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        } else {
          // Standard clothing (T-shirts, Polo Shirts, Hoodies, Sweatshirts, Jackets, Tracksuits)
          return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        }
      } else if (categoryType === 'accessories') {
        return ['One Size', 'S', 'M', 'L', 'XL'];
      }
    }

    // WOMEN category size charts - Smart category-based sizing
    if (gender === 'women') {
      if (categoryType === 'shoes') {
        return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
      } else if (categoryType === 'clothing') {
        // Smart sizing based on specific clothing type
        if (subCategory === 'Salwar Kameez' || subCategory === 'Kurtis') {
          return ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        } else if (subCategory === 'Sarees' || subCategory === 'Burkas' || subCategory === 'Abayas') {
          return ['One Size', 'Free Size'];
        } else if (subCategory === 'Undergarments') {
          return ['32A', '32B', '34A', '34B', '36A', '36B', '38A', '38B', '40A', '40B'];
        } else {
          // Standard clothing (T-shirts, Shirts, Tops, Pants)
          return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        }
      } else if (categoryType === 'accessories') {
        return ['One Size', 'S', 'M', 'L', 'XL'];
      }
    }

    // KIDS category size charts - Age-based smart sizing
    if (gender === 'kids') {
      if (categoryType === 'shoes') {
        // Age-based shoe sizing
        if (subCategory === 'Baby (0-12 months)') {
          return ['0-3M', '3-6M', '6-9M', '9-12M', '1', '2', '3', '4'];
        } else if (subCategory === 'Toddler Girls (1-3 years)' || subCategory === 'Toddler Boys (1-3 years)') {
          return ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
        } else if (subCategory === 'Kid Girls (3-6 years)' || subCategory === 'Kid Boys (3-6 years)') {
          return ['12', '13', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
        } else if (subCategory === 'Teen Girls (9-16 years)' || subCategory === 'Teen Boys (9-16 years)') {
          return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        } else {
          // Default shoe sizes for kids
          return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
        }
      } else if (categoryType === 'clothing') {
        // Age-based clothing sizing
        if (subCategory === 'Baby (0-12 months)') {
          return ['0-3M', '3-6M', '6-9M', '9-12M', '12M', '18M', '24M'];
        } else if (subCategory === 'Toddler Girls (1-3 years)' || subCategory === 'Toddler Boys (1-3 years)') {
          return ['2T', '3T', '4T', '5T'];
        } else if (subCategory === 'Kid Girls (3-6 years)' || subCategory === 'Kid Boys (3-6 years)') {
          return ['3', '4', '5', '6', '7', '8'];
        } else if (subCategory === 'Teen Girls (9-16 years)' || subCategory === 'Teen Boys (9-16 years)') {
          return ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', 'XS', 'S', 'M', 'L', 'XL'];
        } else {
          // Default clothing sizes for kids
          return ['2T', '3T', '4T', '5T', '3', '4', '5', '6', '7', '8', 'XS', 'S', 'M', 'L', 'XL'];
        }
      } else if (categoryType === 'accessories') {
        return ['One Size', 'XS', 'S', 'M', 'L', 'XL'];
      }
    }

    // Return empty array for other categories
    return [];
  };

  // Function to clear all sizes when category changes
  const clearAllSizes = () => {
    setFormData(prev => ({
      ...prev,
      colorBlocks: prev.colorBlocks.map(block => ({
        ...block,
        sizes: block.sizes.map(size => ({
          ...size,
          size: '', // Clear selected size
          quantity: '',
          lowStockThreshold: '',
          basePrice: '',
          salePrice: '',
          costPrice: ''
        }))
      }))
    }));
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Dynamic Size Charts & New Pricing Structure</p>
                        <p>Size charts automatically update based on your category selection. <strong>MEN:</strong> Shoes (39-48), Smart Clothing Sizing (Formal: Collar Sizes + S-XXL, Traditional: Chest Measurements + S-XXXL, Pants: Waist Measurements + S-XXXL, Undergarments: Waist + S-XXXL, Socks: Foot Sizes), Accessories (One Size + S-XL). <strong>WOMEN:</strong> Shoes (35-44), Smart Clothing Sizing (Traditional: Free Size + S-XL, Standard: XS-XXXL, Undergarments: Cup Sizes), Accessories (One Size + S-XL). <strong>KIDS:</strong> Age-Based Smart Sizing (Baby: Months + Sizes, Toddler: 2T-5T, Kids: 3-8, Teens: 7-16 + XS-XL), Shoes: Age-Appropriate US Sizing, Accessories: Standard Sizing. Pricing is handled per color variant with size-level pricing.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="brand" className="block mb-2 text-sm font-medium">Brand *</Label>
                      <div className="flex items-center space-x-2">
                        <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                          <SelectTrigger className={`h-10 w-full ${formData.errors.brand ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder={brandsLoading ? "Loading brands..." : "Search and select brand"} />
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
                            {brandsLoading ? (
                              <div className="px-2 py-1 text-sm text-gray-500 flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                <span>Loading brands...</span>
                              </div>
                            ) : filteredBrands.length > 0 ? (
                              filteredBrands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1 text-sm text-gray-500">
                                {allBrands.length === 0 ? (
                                  <div className="text-center py-2">
                                    <p className="text-red-500 mb-2">No brands available in database</p>
                                    <p className="text-xs text-gray-400 mb-2">Please create some brands first</p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => router.push('/admin/brands')}
                                      className="w-full text-xs"
                                    >
                                      Go to Brands Page
                                    </Button>
                                  </div>
                                ) : (
                                  "No brands match your search"
                                )}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadBrandsFromDatabase}
                          disabled={brandsLoading}
                          className="h-10 px-3"
                          title="Refresh brands from database"
                        >
                          <RefreshCw className={`h-4 w-4 ${brandsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
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
                                <SelectItem key={index} value={item.label}>{item.label}</SelectItem>
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
                                  const files = e.target.files;
                                  if (files) {
                                    handleColorBlockImageUpload(colorBlock.id, Array.from(files));
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
                                        handleColorBlockImageUrlAdd(colorBlock.id, input.value.trim());
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
                                      handleColorBlockImageUrlAdd(colorBlock.id, input.value.trim());
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

                          {/* Image Previews */}
                          <div className="mt-4">
                            <Label className="block mb-2 text-sm font-medium text-gray-600">
                              Image Previews ({colorBlockPreviews[colorBlock.id]?.length || 0} images)
                            </Label>
                            {colorBlockPreviews[colorBlock.id] && colorBlockPreviews[colorBlock.id].length > 0 ? (
                              <div className="grid grid-cols-4 gap-2">
                                {colorBlockPreviews[colorBlock.id].map((imageData, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={imageData.preview}
                                      alt={`Preview ${index + 1}`}
                                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeColorBlockImage(colorBlock.id, index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                No images uploaded yet. Upload images or add URLs above.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sizes + Stock + Pricing */}
                        <div>
                          <Label className="block mb-2 text-sm font-medium">Sizes + Stock + Pricing *</Label>
                          
                          {/* Category-based size chart info */}
                          {getSizeChartForCategory().length > 0 ? (
                            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                              <span className="font-medium">Available sizes for {formData.categoryLevel1} {formData.categoryLevel2}{formData.categoryLevel3 ? ` > ${formData.categoryLevel3}` : ''}:</span> {getSizeChartForCategory().join(', ')}
                              {formData.categoryLevel1 === 'women' && formData.categoryLevel2 === 'clothing' && formData.categoryLevel3 && (
                                <div className="mt-1 text-blue-600">
                                  {formData.categoryLevel3 === 'Salwar Kameez' || formData.categoryLevel3 === 'Kurtis' ? 
                                    'Traditional wear with Free Size + standard sizing' :
                                    formData.categoryLevel3 === 'Sarees' || formData.categoryLevel3 === 'Burkas' || formData.categoryLevel3 === 'Abayas' ? 
                                    'Loose-fitting garments with One Size/Free Size' :
                                    formData.categoryLevel3 === 'Undergarments' ? 
                                    'Bra sizing with cup and band measurements' :
                                    'Standard clothing with XS-XXXL sizing'
                                  }
                                </div>
                              )}
                              
                              {/* MEN clothing explanations */}
                              {formData.categoryLevel1 === 'men' && formData.categoryLevel2 === 'clothing' && formData.categoryLevel3 && (
                                <div className="mt-1 text-blue-600">
                                  {formData.categoryLevel3 === 'Business Shirts' || formData.categoryLevel3 === 'Suits' ? 
                                    'Formal wear with collar sizes + standard sizing' :
                                    formData.categoryLevel3 === 'Panjabis' ? 
                                    'Traditional wear with chest measurements + standard sizing' :
                                    formData.categoryLevel3 === 'Pants' || formData.categoryLevel3 === 'Gabardines' || formData.categoryLevel3 === 'Jeans' || formData.categoryLevel3 === 'Trousers' || formData.categoryLevel3 === 'Shorts' ? 
                                    'Pants with waist measurements + standard sizing' :
                                    formData.categoryLevel3 === 'Underwear' ? 
                                    'Undergarments with waist measurements + standard sizing' :
                                    formData.categoryLevel3 === 'Socks' ? 
                                    'Footwear with shoe size measurements' :
                                    formData.categoryLevel3 === 'Pajamas' ? 
                                    'Sleepwear with standard sizing' :
                                    'Standard clothing with XS-XXXL sizing'
                                  }
                                </div>
                              )}
                              
                              {/* KIDS explanations */}
                              {formData.categoryLevel1 === 'kids' && formData.categoryLevel2 && formData.categoryLevel3 && (
                                <div className="mt-1 text-blue-600">
                                  {formData.categoryLevel2 === 'shoes' ? (
                                    formData.categoryLevel3 === 'Baby (0-12 months)' ? 
                                      'Baby shoes with age-based sizing (months + sizes)' :
                                      formData.categoryLevel3 === 'Toddler Girls (1-3 years)' || formData.categoryLevel3 === 'Toddler Boys (1-3 years)' ? 
                                      'Toddler shoes with US sizing (4-12)' :
                                      formData.categoryLevel3 === 'Kid Girls (3-6 years)' || formData.categoryLevel3 === 'Kid Boys (3-6 years)' ? 
                                      'Kid shoes with US sizing (1-13)' :
                                      formData.categoryLevel3 === 'Teen Girls (9-16 years)' || formData.categoryLevel3 === 'Teen Boys (9-16 years)' ? 
                                      'Teen shoes with US sizing (1-16)' :
                                      'Kids shoes with age-appropriate sizing'
                                  ) : formData.categoryLevel2 === 'clothing' ? (
                                    formData.categoryLevel3 === 'Baby (0-12 months)' ? 
                                      'Baby clothing with age-based sizing (months)' :
                                      formData.categoryLevel3 === 'Toddler Girls (1-3 years)' || formData.categoryLevel3 === 'Toddler Boys (1-3 years)' ? 
                                      'Toddler clothing with age-based sizing (2T-5T)' :
                                      formData.categoryLevel3 === 'Kid Girls (3-6 years)' || formData.categoryLevel3 === 'Kid Boys (3-6 years)' ? 
                                      'Kid clothing with age-based sizing (3-8)' :
                                      formData.categoryLevel3 === 'Teen Girls (9-16 years)' || formData.categoryLevel3 === 'Teen Boys (9-16 years)' ? 
                                      'Teen clothing with age-based sizing (7-16) + standard (XS-XL)' :
                                      'Kids clothing with age-appropriate sizing'
                                  ) : formData.categoryLevel2 === 'accessories' ? 
                                      'Kids accessories with standard sizing' :
                                      'Kids products with age-appropriate sizing'
                                  }
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                              <span className="font-medium">Please select a category first to see available sizes</span>
                            </div>
                          )}
                          <div className="space-y-3">
                            {/* Header row for size fields */}
                            <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-600 mb-2">
                              <div>Size</div>
                              <div>Quantity</div>
                              <div>Low Stock</div>
                              <div>Base Price *</div>
                              <div>Sale Price</div>
                              <div>Cost Price</div>
                              <div>Action</div>
                            </div>
                            
                            {colorBlock.sizes.map((size) => (
                              <div key={size.id} className="grid grid-cols-7 gap-2 items-center">
                                <div>
                                  <Select 
                                    value={size.size} 
                                    onValueChange={(value) => updateSizeInColorBlock(colorBlock.id, size.id, 'size', value)}
                                    disabled={getSizeChartForCategory().length === 0}
                                  >
                                    <SelectTrigger className="h-10 w-full">
                                      <SelectValue placeholder={
                                        getSizeChartForCategory().length === 0 
                                          ? "Select category first" 
                                          : "Select size"
                                      } />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getSizeChartForCategory().length > 0 ? (
                                        getSizeChartForCategory().map((sizeOption) => (
                                          <SelectItem key={sizeOption} value={sizeOption}>
                                            {sizeOption}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <div className="px-2 py-1 text-sm text-gray-500">
                                          Please select a category first
                                        </div>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={size.quantity}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'quantity', e.target.value)}
                                    placeholder="Qty"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={size.lowStockThreshold}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'lowStockThreshold', e.target.value)}
                                    placeholder="Threshold"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={size.basePrice}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'basePrice', e.target.value)}
                                    placeholder="0.00"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={size.salePrice}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'salePrice', e.target.value)}
                                    placeholder="0.00"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={size.costPrice}
                                    onChange={(e) => updateSizeInColorBlock(colorBlock.id, size.id, 'costPrice', e.target.value)}
                                    placeholder="0.00"
                                    className="h-10 w-full"
                                  />
                                </div>
                                <div>
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