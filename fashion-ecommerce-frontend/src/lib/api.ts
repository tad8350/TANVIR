const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AdminLoginResponse {
  access_token: string;
  admin: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface ProductFormData {
  name: string;
  title: string;
  description?: string;
  shortDescription?: string;
  price: string;
  salePrice?: string;
  costPrice?: string;
  sku: string;
  barcode?: string;
  brand: string;
  status: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  categoryLevel4?: string;
  category: string;
  lowStockThreshold?: string;
  colorBlocks: Array<{
    id: string;
    color: string;
    newColor: string;
    images: File[];
    sizes: Array<{
      id: string;
      size: string;
      quantity: string;
    }>;
  }>;
  images: string[];
  mainImage?: string;
  hasVariants: boolean;
  variantType?: string;
  variants: any[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  tags: string[];
  shippingWeight?: string;
  shippingDimensions?: {
    length: string;
    width: string;
    height: string;
  };
  freeShipping: boolean;
  shippingClass?: string;
  taxClass?: string;
  taxRate?: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  maxOrderQuantity?: string;
  minOrderQuantity?: string;
  isVirtual: boolean;
  isDownloadable: boolean;
  downloadLimit?: string;
  downloadExpiry?: string;
}

// Helper function to get token from cookies
function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// Helper function to set token in cookies
function setToken(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

// Helper function to remove token from cookies
function removeToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
    const url = `${API_BASE_URL}/auth/admin/login`;
    const token = getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      // Store the token if login is successful
      if (data.access_token) {
        setToken(data.access_token);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Logout function
  logout(): void {
    removeToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return getToken() !== null;
  }

  // Product endpoints
  async createProduct(productData: ProductFormData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getProducts(page: number = 1, limit: number = 10, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/products?${params}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  async updateProduct(id: number, productData: Partial<ProductFormData>) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Dropdown data endpoints
  async getBrands() {
    return this.request<string[]>('/products/brands/list');
  }

  async getColors() {
    return this.request<string[]>('/products/colors/list');
  }

  async getSizes() {
    return this.request<string[]>('/products/sizes/list');
  }

  // Categories endpoints
  async getCategories(parentId?: number) {
    const params = parentId ? `?parent_id=${parentId}` : '';
    return this.request(`/products/categories${params}`);
  }

  async getCategoryTree() {
    return this.request('/products/categories/tree');
  }

  // Brand endpoints
  async getBrandsList(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request(`/products/brands?${params}`);
  }

  async getBrand(id: number) {
    return this.request(`/products/brands/${id}`);
  }

  async createBrand(brandData: any) {
    return this.request('/products/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
  }

  async updateBrand(id: number, brandData: any) {
    return this.request(`/products/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
  }

  async deleteBrand(id: number) {
    return this.request(`/products/brands/${id}`, {
      method: 'DELETE',
    });
  }

  // Color endpoints
  async getColorsList() {
    return this.request('/products/colors');
  }

  async createColor(colorData: any) {
    return this.request('/products/colors', {
      method: 'POST',
      body: JSON.stringify(colorData),
    });
  }

  async updateColor(id: number, colorData: any) {
    return this.request(`/products/colors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(colorData),
    });
  }

  async deleteColor(id: number) {
    return this.request(`/products/colors/${id}`, {
      method: 'DELETE',
    });
  }

  // Size endpoints
  async getSizesList() {
    return this.request('/products/sizes');
  }

  async createSize(sizeData: any) {
    return this.request('/products/sizes', {
      method: 'POST',
      body: JSON.stringify(sizeData),
    });
  }

  async updateSize(id: number, sizeData: any) {
    return this.request(`/products/sizes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sizeData),
    });
  }

  async deleteSize(id: number) {
    return this.request(`/products/sizes/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard specific methods
  async fetchFeaturedProducts(limit: number = 20) {
    return this.request(`/products?limit=${limit}&featured=true`);
  }

  async fetchCategories() {
    return this.request('/products/categories');
  }

  async fetchBrands(options: { limit?: number } = {}) {
    const params = new URLSearchParams({
      limit: (options.limit || 10).toString(),
    });
    return this.request(`/products/brands?${params}`);
  }

  async fetchColors() {
    return this.request('/products/colors');
  }

  async fetchSizes() {
    return this.request('/products/sizes');
  }

  // Product utility methods
  getProductPrice(product: any) {
    const price = parseFloat(product.price) || 0;
    const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
    
    return {
      price,
      discountPrice: salePrice,
      hasDiscount: salePrice !== null && salePrice < price,
      discountPercentage: salePrice ? Math.round(((price - salePrice) / price) * 100) : 0
    };
  }

  getProductRating(product: any) {
    // Mock rating for now - you can implement real rating logic
    return {
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10
    };
  }

  getProductImage(product: any) {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/images/placeholder-product.jpg';
  }

  getProductVariantsWithDetails(product: any) {
    // Mock variants for now
    return product.variants || [];
  }
}

export const apiService = new ApiService(); 