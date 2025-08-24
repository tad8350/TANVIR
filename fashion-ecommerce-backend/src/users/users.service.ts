import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { BrandProfile } from './entities/brand-profile.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CustomerProfile } from './entities/customer-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BrandProfile)
    private brandProfileRepository: Repository<BrandProfile>,
    @InjectRepository(AdminProfile)
    private adminProfileRepository: Repository<AdminProfile>,
    @InjectRepository(CustomerProfile)
    private customerProfileRepository: Repository<CustomerProfile>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    // Get users from users table
    const [users, totalUsers] = await this.userRepository.findAndCount({
      where: search ? [
        { email: Like(`%${search}%`) },
      ] : {},
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    // Get brands from brand_profiles table (that don't have user records)
    const brandProfiles = await this.brandProfileRepository.find({
      where: search ? [
        { contact_email: Like(`%${search}%`) },
        { owner_email: Like(`%${search}%`) },
      ] : {},
      relations: ['user'],
    });

    // Filter brands that don't have user records
    const brandsWithoutUsers = brandProfiles.filter(brand => !brand.user);

    // Get admins from admin_profiles table
    const adminProfiles = await this.adminProfileRepository.find({
      where: search ? [
        { email: Like(`%${search}%`) },
      ] : {},
    });

    // Include all admin profiles since they don't have user relations
    const allAdmins = adminProfiles;

    // Combine all users and create a unified response
    const allUsers = [
      ...users,
      ...brandsWithoutUsers.map(brand => ({
        id: `brand_${brand.id}`,
        email: brand.contact_email || brand.owner_email,
        user_type: 'brand',
        is_verified: brand.is_verified,
        is_active: true, // Brands are considered active by default
        last_login: null,
        created_at: brand.created_at,
        updated_at: brand.updated_at,
        // Add brand-specific fields for reference
        brand_name: brand.brand_name,
        business_name: brand.business_name,
        category: brand.category,
      })),
      ...allAdmins.map(admin => ({
        id: `admin_${admin.id}`,
        email: admin.email,
        user_type: 'admin',
        is_verified: true, // Admins are verified by default
        is_active: admin.is_active,
        last_login: admin.last_login,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
        // Add admin-specific fields for reference
        name: admin.name,
        role: admin.role,
      }))
    ];

    // Apply pagination to the combined results
    const total = allUsers.length;
    const paginatedUsers = allUsers.slice(skip, skip + limit);

    return {
      data: paginatedUsers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(search?: string) {
    // Get all users from users table (this includes customers, brands, and admins)
    const users = await this.userRepository.find({
      where: search ? [
        { email: Like(`%${search}%`) },
      ] : {},
      order: { created_at: 'DESC' },
    });

    // Get brands from brand_profiles table (that don't have user records)
    const brandProfiles = await this.brandProfileRepository.find({
      where: search ? [
        { contact_email: Like(`%${search}%`) },
        { owner_email: Like(`%${search}%`) },
      ] : {},
      relations: ['user'],
    });

    // Filter brands that don't have user records
    const brandsWithoutUsers = brandProfiles.filter(brand => !brand.user);

    // Get admins from admin_profiles table
    const adminProfiles = await this.adminProfileRepository.find({
      where: search ? [
        { email: Like(`%${search}%`) },
      ] : {},
    });

    // Combine all users and create a unified response
    const allUsers = [
      ...users,
      ...brandsWithoutUsers.map(brand => ({
        id: `brand_${brand.id}`,
        email: brand.contact_email || brand.owner_email,
        user_type: 'brand',
        is_verified: brand.is_verified,
        is_active: true, // Brands are considered active by default
        last_login: null,
        created_at: brand.created_at,
        updated_at: brand.updated_at,
        // Add brand-specific fields for reference
        brand_name: brand.brand_name,
        business_name: brand.business_name,
        category: brand.category,
      })),
      ...adminProfiles.map(admin => ({
        id: `admin_${admin.id}`,
        email: admin.email,
        user_type: 'admin',
        is_verified: true, // Admins are verified by default
        is_active: admin.is_active,
        last_login: admin.last_login,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
        // Add admin-specific fields for reference
        name: admin.name,
        role: admin.role,
      }))
    ];

    // Return comprehensive user list with counts
    const userTypeCounts = allUsers.reduce((acc, user) => {
      acc[user.user_type] = (acc[user.user_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: allUsers,
      meta: {
        total: allUsers.length,
        userTypeCounts,
        summary: {
          customers: userTypeCounts.customer || 0,
          brands: userTypeCounts.brand || 0,
          admins: userTypeCounts.admin || 0,
        }
      },
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto & { 
    firstName?: string; 
    lastName?: string; 
    googleId?: string; 
    picture?: string; 
  }) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Handle Google users (no password hashing needed)
    const password = createUserDto.password ? await bcrypt.hash(createUserDto.password, 10) : '';
    
    const user = this.userRepository.create({
      email: createUserDto.email,
      password,
      user_type: createUserDto.user_type,
    });

    const savedUser = await this.userRepository.save(user);

    // Create profile based on user type
    if (savedUser.user_type === 'customer') {
      // Create customer profile
      await this.createCustomerProfile(savedUser.id, createUserDto.firstName, createUserDto.lastName, createUserDto.googleId, createUserDto.picture);
    }

    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Only update allowed fields
    const updateData: any = {};
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.password) updateData.password = updateUserDto.password;
    if (updateUserDto.user_type) updateData.user_type = updateUserDto.user_type;
    if (updateUserDto.is_verified !== undefined) updateData.is_verified = updateUserDto.is_verified;
    if (updateUserDto.is_active !== undefined) updateData.is_active = updateUserDto.is_active;

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async updateLastLogin(id: number) {
    const user = await this.findOne(id);
    user.last_login = new Date();
    return this.userRepository.save(user);
  }

  private async createCustomerProfile(userId: number, firstName?: string, lastName?: string, googleId?: string, picture?: string) {
    try {
      // Create customer profile in the customer_profiles table
      const customerProfile = this.customerProfileRepository.create({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        // Add other fields as needed
        newsletter_subscription: false,
        marketing_consent: false,
      });
      
      await this.customerProfileRepository.save(customerProfile);
      console.log(`✅ Customer profile created successfully for user ${userId}:`, {
        firstName,
        lastName,
        googleId,
        picture
      });
    } catch (error) {
      console.error(`❌ Error creating customer profile for user ${userId}:`, error);
      // Don't throw error to avoid breaking user creation
      // The user will still be created, just without a profile
    }
  }
} 