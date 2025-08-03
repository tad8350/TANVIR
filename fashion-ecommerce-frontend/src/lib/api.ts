const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  brand: {
    id: number;
    brand_name: string;
    logo_url?: string;
  };
  category: {
    id: number;
    name: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
  reviews?: Review[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color_id?: number;
  size_id?: number;
  stock: number;
  price: string; // Note: price is returned as string from database
  discount_price?: string | null; // Note: discount_price is returned as string from database
  sku: string;
  is_active: boolean;
  color?: {
    id: number;
    name: string;
    hex_code: string;
  };
  size?: {
    id: number;
    name: string;
  };
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string; // Note: field is 'url' not 'image_url'
  is_primary?: boolean;
  created_at?: string;
}

export interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
  updated_at: string;
}

export interface Size {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Brand {
  id: number;
  brand_name: string; // Note: field is 'brand_name' not 'name'
  description?: string;
  logo_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch products with optional filters
export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  status?: string;
} = {}): Promise<ApiResponse<Product>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.category_id) searchParams.append('category_id', params.category_id.toString());
  if (params.brand_id) searchParams.append('brand_id', params.brand_id.toString());
  if (params.status) searchParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch product variants
export async function fetchProductVariants(params: {
  page?: number;
  limit?: number;
  product_id?: number;
} = {}): Promise<ApiResponse<ProductVariant>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.product_id) searchParams.append('product_id', params.product_id.toString());

  const response = await fetch(`${API_BASE_URL}/product-variants?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product variants: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch product images
export async function fetchProductImages(productId?: number): Promise<ProductImage[]> {
  const searchParams = new URLSearchParams();
  if (productId) searchParams.append('product_id', productId.toString());

  const response = await fetch(`${API_BASE_URL}/product-images?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product images: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch colors
export async function fetchColors(): Promise<Color[]> {
  const response = await fetch(`${API_BASE_URL}/colors`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch colors: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch sizes
export async function fetchSizes(): Promise<Size[]> {
  const response = await fetch(`${API_BASE_URL}/sizes`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sizes: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch featured products (active products with images)
export async function fetchFeaturedProducts(limit: number = 10): Promise<Product[]> {
  const response = await fetchProducts({
    limit,
    status: 'active'
  });
  
  // Filter products that have images and variants
  return response.data.filter(product => 
    product.images && product.images.length > 0 && 
    product.variants && product.variants.length > 0
  );
}

// Fetch categories
export async function fetchCategories(parentId?: number): Promise<Category[]> {
  const searchParams = new URLSearchParams();
  if (parentId) searchParams.append('parent_id', parentId.toString());

  const response = await fetch(`${API_BASE_URL}/categories?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch brands
export async function fetchBrands(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<ApiResponse<Brand>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/brands?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  
  return response.json();
}

// Get product with lowest price variant
export function getProductPrice(product: Product): { price: number; discountPrice?: number } {
  if (!product.variants || product.variants.length === 0) {
    return { price: 0 };
  }
  
  const activeVariants = product.variants.filter(v => v.is_active);
  if (activeVariants.length === 0) {
    return { price: 0 };
  }
  
  const lowestPriceVariant = activeVariants.reduce((lowest, current) => {
    const currentPrice = current.discount_price ? parseFloat(current.discount_price) : parseFloat(current.price);
    const lowestPrice = lowest.discount_price ? parseFloat(lowest.discount_price) : parseFloat(lowest.price);
    return currentPrice < lowestPrice ? current : lowest;
  });
  
  return {
    price: parseFloat(lowestPriceVariant.price) || 0,
    discountPrice: lowestPriceVariant.discount_price ? parseFloat(lowestPriceVariant.discount_price) : undefined
  };
}

// Get product average rating
export function getProductRating(product: Product): { rating: number; reviewCount: number } {
  if (!product.reviews || product.reviews.length === 0) {
    return { rating: 0, reviewCount: 0 };
  }
  
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / product.reviews.length;
  
  return {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    reviewCount: product.reviews.length
  };
}

// Get primary product image
export function getProductImage(product: Product): string | null {
  if (!product.images || product.images.length === 0) {
    return null;
  }
  
  const primaryImage = product.images.find(img => img.is_primary);
  return primaryImage ? primaryImage.url : product.images[0].url;
}

// Get product variants with color and size information
export async function getProductVariantsWithDetails(productId: number): Promise<ProductVariant[]> {
  try {
    const variantsResponse = await fetchProductVariants({ product_id: productId });
    const colors = await fetchColors();
    const sizes = await fetchSizes();
    
    return variantsResponse.data.map(variant => ({
      ...variant,
      color: colors.find(c => c.id === variant.color_id),
      size: sizes.find(s => s.id === variant.size_id)
    }));
  } catch (error) {
    console.error('Error fetching product variants with details:', error);
    return [];
  }
} 