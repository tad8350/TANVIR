import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { BrandProfile } from '../users/entities/brand-profile.entity';
import { User } from '../users/entities/user.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandProfile)
    private brandRepository: Repository<BrandProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? { brand_name: Like(`%${search}%`) } : {};
    
    const [brands, total] = await this.brandRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      select: [
        'id', 'user_id', 'brand_name', 'business_name', 'category', 'description',
        'logo_url', 'banner_url', 'website_url', 'website', 'facebook_url', 'instagram_url',
        'twitter_url', 'linkedin_url', 'contact_email', 'phone_number', 'contact_person',
        'phone', 'address', 'region', 'district', 'registration_number', 'business_license',
        'tax_id', 'tin_number', 'trade_license', 'vat_registration', 'import_export_license',
        'payment_method', 'payment_phone', 'account_holder_name', 'payment_email',
        'warehouse_location', 'physical_shops', 'return_policy', 'warranty_policy',
        'minimum_order_quantity', 'shipping_zones', 'commission_rate', 'payment_terms',
        'commission_structure', 'payment_schedule', 'minimum_payout_amount', 'tax_deduction_details',
        'owner_full_name', 'owner_email', 'owner_password', 'api_keys', 'webhook_urls',
        'integration_settings', 'payment_methods', 'shipping_methods', 'is_verified',
        'bank_account', 'created_at', 'updated_at'
      ]
    });

    console.log('Brands service - Found brands:', brands.length);
    console.log('Sample brand data:', brands[0]);

    return {
      data: brands,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    // Step 1: Create brand user account (for login)
    const brandUser = await this.userRepository.save({
      email: createBrandDto.contact_email,
      password: this.generateSecurePassword(), // Generate secure password
      user_type: 'brand',
      is_verified: true,
      is_active: true
    });

    // Step 2: Create brand profile (business info)
    const brandData = {
      user_id: brandUser.id, // Link to user account
      brand_name: createBrandDto.brand_name,
      business_name: createBrandDto.business_name || createBrandDto.brand_name,
      description: createBrandDto.description || '',
      logo_url: createBrandDto.logo_url || undefined,
      banner_url: createBrandDto.banner_url || undefined,
      website_url: createBrandDto.website_url || undefined,
      contact_email: createBrandDto.contact_email || undefined,
      phone_number: createBrandDto.phone_number || undefined,
      contact_person: createBrandDto.contact_person || '',
      phone: createBrandDto.phone || createBrandDto.phone_number || '',
      website: createBrandDto.website || createBrandDto.website_url || '',
      
      // Store the generated password for later retrieval
      generated_password: brandUser.password,
      
      // Map all the new comprehensive fields
      category: createBrandDto.category || '',
      address: createBrandDto.address || '',
      region: createBrandDto.region || '',
      district: createBrandDto.district || '',
      registration_number: createBrandDto.registration_number || '',
      business_license: createBrandDto.business_license || '',
      tax_id: createBrandDto.tax_id || '',
      tin_number: createBrandDto.tin_number || '',
      trade_license: createBrandDto.trade_license || '',
      vat_registration: createBrandDto.vat_registration || '',
      import_export_license: createBrandDto.import_export_license || '',
      payment_method: createBrandDto.payment_method || '',
      payment_phone: createBrandDto.payment_phone || '',
      account_holder_name: createBrandDto.account_holder_name || '',
      payment_email: createBrandDto.payment_email || '',
      warehouse_location: createBrandDto.warehouse_location || '',
      physical_shops: createBrandDto.physical_shops || '',
      return_policy: createBrandDto.return_policy || '',
      warranty_policy: createBrandDto.warranty_policy || '',
      minimum_order_quantity: createBrandDto.minimum_order_quantity || '',
      shipping_zones: createBrandDto.shipping_zones || '',
      commission_rate: createBrandDto.commission_rate || 10,
      payment_terms: createBrandDto.payment_terms || '',
      commission_structure: createBrandDto.commission_structure || '',
      payment_schedule: createBrandDto.payment_schedule || '',
      minimum_payout_amount: createBrandDto.minimum_payout_amount || '',
      tax_deduction_details: createBrandDto.tax_deduction_details || '',
      owner_full_name: createBrandDto.owner_full_name || '',
      owner_email: createBrandDto.owner_email || '',
      owner_password: brandUser.password, // Store generated password here
      facebook_url: createBrandDto.facebook_url || '',
      instagram_url: createBrandDto.instagram_url || '',
      twitter_url: createBrandDto.twitter_url || '',
      linkedin_url: createBrandDto.linkedin_url || '',
      api_keys: createBrandDto.api_keys || '',
      webhook_urls: createBrandDto.webhook_urls || '',
      integration_settings: createBrandDto.integration_settings || '',
      
      // Default values for required fields
      is_verified: false,
      payment_methods: {},
      shipping_methods: {},
      bank_account: {}
    };
    
    const brand = this.brandRepository.create(brandData);
    const savedBrand = await this.brandRepository.save(brand);

    // Step 3: Return brand info + login credentials for admin
    return {
      brand: savedBrand,
      loginCredentials: {
        email: brandUser.email,
        password: brandUser.password, // This will be shown to admin to send to brand
        message: 'Send these credentials to the brand for portal access'
      }
    };
  }

  private generateSecurePassword(): string {
    // Generate a secure random password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    
    // Map all the comprehensive fields for update
    const updateData = {
      brand_name: updateBrandDto.brand_name,
      business_name: updateBrandDto.business_name,
      description: updateBrandDto.description,
      logo_url: updateBrandDto.logo_url,
      banner_url: updateBrandDto.banner_url,
      website_url: updateBrandDto.website_url,
      website: updateBrandDto.website,
      category: updateBrandDto.category,
      contact_email: updateBrandDto.contact_email,
      phone_number: updateBrandDto.phone_number,
      contact_person: updateBrandDto.contact_person,
      phone: updateBrandDto.phone,
      address: updateBrandDto.address,
      region: updateBrandDto.region,
      district: updateBrandDto.district,
      registration_number: updateBrandDto.registration_number,
      business_license: updateBrandDto.business_license,
      tax_id: updateBrandDto.tax_id,
      tin_number: updateBrandDto.tin_number,
      trade_license: updateBrandDto.trade_license,
      vat_registration: updateBrandDto.vat_registration,
      import_export_license: updateBrandDto.import_export_license,
      payment_method: updateBrandDto.payment_method,
      payment_phone: updateBrandDto.payment_phone,
      account_holder_name: updateBrandDto.account_holder_name,
      payment_email: updateBrandDto.payment_email,
      warehouse_location: updateBrandDto.warehouse_location,
      physical_shops: updateBrandDto.physical_shops,
      return_policy: updateBrandDto.return_policy,
      warranty_policy: updateBrandDto.warranty_policy,
      minimum_order_quantity: updateBrandDto.minimum_order_quantity,
      shipping_zones: updateBrandDto.shipping_zones,
      commission_rate: updateBrandDto.commission_rate,
      payment_terms: updateBrandDto.payment_terms,
      commission_structure: updateBrandDto.commission_structure,
      payment_schedule: updateBrandDto.payment_schedule,
      minimum_payout_amount: updateBrandDto.minimum_payout_amount,
      tax_deduction_details: updateBrandDto.tax_deduction_details,
      owner_full_name: updateBrandDto.owner_full_name,
      owner_email: updateBrandDto.owner_email,
      owner_password: updateBrandDto.owner_password,
      facebook_url: updateBrandDto.facebook_url,
      instagram_url: updateBrandDto.instagram_url,
      twitter_url: updateBrandDto.twitter_url,
      linkedin_url: updateBrandDto.linkedin_url,
      api_keys: updateBrandDto.api_keys,
      webhook_urls: updateBrandDto.webhook_urls,
      integration_settings: updateBrandDto.integration_settings
    };

    // Only update fields that are provided (not undefined)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        brand[key] = updateData[key];
      }
    });

    return this.brandRepository.save(brand);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return { message: 'Brand deleted successfully' };
  }

  async getCredentials(id: number) {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return {
      email: brand.contact_email,
      password: brand.owner_password, // Use owner_password field
      message: 'Brand login credentials retrieved successfully'
    };
  }
} 