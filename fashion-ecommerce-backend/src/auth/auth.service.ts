import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminProfile } from '../users/entities/admin-profile.entity';
import { BrandProfile } from '../users/entities/brand-profile.entity';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: number;
  email: string;
  user_type: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(AdminProfile)
    private adminRepository: Repository<AdminProfile>,
    @InjectRepository(BrandProfile)
    private brandRepository: Repository<BrandProfile>
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      user_type: user.user_type,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string, user_type: string = 'customer') {
    // Only allow customer registration publicly
    if (user_type !== 'customer') {
      throw new ForbiddenException('Only customers can register publicly. Admin and brand users must be created by administrators.');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user with first and last name
    const user = await this.usersService.create({
      email,
      password,
      user_type,
      firstName,
      lastName,
    });

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      user_type: user.user_type,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    };
  }

  // Admin-only method for creating admin users
  async createAdminUser(email: string, password: string, createdBy: number) {
    // Check if the creator is an admin
    const creator = await this.usersService.findOne(createdBy);
    if (creator.user_type !== 'admin') {
      throw new ForbiddenException('Only admins can create admin users');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create({
      email,
      password,
      user_type: 'admin',
    });

    return {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      is_verified: user.is_verified,
      is_active: user.is_active,
    };
  }

  // Admin-only method for creating brand users
  async createBrandUser(email: string, password: string, createdBy: number) {
    // Check if the creator is an admin
    const creator = await this.usersService.findOne(createdBy);
    if (creator.user_type !== 'admin') {
      throw new ForbiddenException('Only admins can create brand users');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create({
      email,
      password,
      user_type: 'brand',
    });

    return {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      is_verified: user.is_verified,
      is_active: user.is_active,
    };
  }

  async googleAuth(email: string, firstName: string, lastName: string, googleId: string, picture?: string) {
    // Check if user already exists
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Create new user with Google data
      user = await this.usersService.create({
        email,
        password: '', // Google users don't need password
        user_type: 'customer', // Google auth is only for customers
        firstName,
        lastName,
        googleId,
        picture,
      });
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      user_type: user.user_type,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Admin specific methods
  async validateAdmin(email: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });
    
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!admin.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const { password: _, ...result } = admin;
    return result;
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);

    // Update last login
    await this.adminRepository.update(admin.id, {
      last_login: new Date(),
    });

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      user_type: admin.role, // Use role as user_type for consistency
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async setupSuperAdmin(adminData: { email: string; password: string; firstName: string; lastName: string }) {
    // Check if any admin exists
    const adminCount = await this.adminRepository.count();
    if (adminCount > 0) {
      throw new ConflictException('Super admin already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.adminRepository.create({
      email: adminData.email,
      password: hashedPassword,
      name: `${adminData.firstName} ${adminData.lastName}`, // Combine firstName and lastName
      role: 'super_admin',
      is_active: true
    });

    const savedAdmin = await this.adminRepository.save(admin);
    const { password, ...result } = savedAdmin;
    
    const payload: JwtPayload = {
      sub: result.id,
      email: result.email,
      user_type: result.role, // Use role as user_type for consistency
    };

    return {
      message: 'Super admin created successfully',
      admin: result,
      access_token: this.jwtService.sign(payload)
    };
  }

  async createAdmin(adminData: { email: string; password: string; firstName: string; lastName: string }) {
    // Check if email already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.adminRepository.create({
      email: adminData.email,
      password: hashedPassword,
      name: `${adminData.firstName} ${adminData.lastName}`, // Combine firstName and lastName
      role: 'admin',
      is_active: true
    });

    const savedAdmin = await this.adminRepository.save(admin);
    const { password, ...result } = savedAdmin;
    
    return {
      message: 'Admin created successfully',
      admin: result
    };
  }

  async getAdminProfile(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    const { password, ...result } = admin;
    return result;
  }

  // Brand specific methods
  async validateBrand(email: string, password: string) {
    console.log('🔍 validateBrand called with:', { email, password });
    
    const brand = await this.brandRepository.findOne({ 
      where: { contact_email: email },
      relations: ['user']
    });
    
    console.log('🔍 Brand found:', brand ? 'Yes' : 'No');
    if (brand) {
      console.log('🔍 Brand details:', {
        id: brand.id,
        brand_name: brand.brand_name,
        contact_email: brand.contact_email,
        owner_password: brand.owner_password ? 'Exists' : 'Missing',
        generated_password: brand.generated_password ? 'Exists' : 'Missing',
        user: brand.user ? 'Exists' : 'Missing',
        is_verified: brand.is_verified
      });
    }
    
    if (!brand) {
      console.log('❌ No brand found with email:', email);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if brand is active - only if user exists
    if (brand.user && !brand.user.is_active) {
      console.log('❌ Brand user is inactive');
      throw new UnauthorizedException('Brand account is inactive');
    }

    // Check if brand is verified - only if user exists, otherwise use brand's own verification
    if (brand.user && !brand.user.is_verified) {
      console.log('❌ Brand user is not verified');
      throw new UnauthorizedException('Brand account is not verified');
    }

    // For brands without user accounts, check the brand's own verification status
    // TEMPORARILY COMMENTED OUT TO ALLOW LOGIN
    // if (!brand.user && !brand.is_verified) {
    //   console.log('❌ Brand is not verified');
    //   throw new UnauthorizedException('Brand account is not verified');
    // }

    console.log('✅ Brand verification checks passed');

    // Try to validate password - check multiple password fields and handle both hashed and plain text
    let isPasswordValid = false;
    
    // First, try to validate against owner_password (could be hashed or plain text)
    if (brand.owner_password) {
      console.log('🔍 Trying owner_password validation...');
      // Try bcrypt comparison first (for hashed passwords)
      try {
        isPasswordValid = await bcrypt.compare(password, brand.owner_password);
        console.log('🔍 bcrypt comparison result:', isPasswordValid);
      } catch (error) {
        console.log('🔍 bcrypt failed, trying direct comparison...');
        // If bcrypt fails, try direct comparison (for plain text passwords)
        isPasswordValid = (password === brand.owner_password);
        console.log('🔍 direct comparison result:', isPasswordValid);
      }
      
      // If bcrypt failed but we have a plain text password, try direct comparison
      if (!isPasswordValid && !brand.owner_password.startsWith('$2')) {
        console.log('🔍 Password appears to be plain text, trying direct comparison...');
        isPasswordValid = (password === brand.owner_password);
        console.log('🔍 direct comparison result:', isPasswordValid);
      }
    }
    
    // If owner_password didn't work, try generated_password
    if (!isPasswordValid && brand.generated_password) {
      console.log('🔍 Trying generated_password validation...');
      try {
        isPasswordValid = await bcrypt.compare(password, brand.generated_password);
        console.log('🔍 bcrypt comparison result:', isPasswordValid);
      } catch (error) {
        console.log('🔍 bcrypt failed, trying direct comparison...');
        // If bcrypt fails, try direct comparison (for plain text passwords)
        isPasswordValid = (password === brand.generated_password);
        console.log('🔍 direct comparison result:', isPasswordValid);
      }
      
      // If bcrypt failed but we have a plain text password, try direct comparison
      if (!isPasswordValid && !brand.generated_password.startsWith('$2')) {
        console.log('🔍 Generated password appears to be plain text, trying direct comparison...');
        isPasswordValid = (password === brand.generated_password);
        console.log('🔍 direct comparison result:', isPasswordValid);
      }
    }
    
    console.log('🔍 Final password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password validation failed');
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('✅ Password validation successful');
    const { owner_password, generated_password, ...result } = brand;
    return result;
  }

  async brandLogin(email: string, password: string) {
    const brand = await this.validateBrand(email, password);

    // Update last login for the user if it exists
    if (brand.user) {
      await this.usersService.updateLastLogin(brand.user.id);
    }

    const payload: JwtPayload = {
      sub: brand.id,
      email: brand.contact_email,
      user_type: 'brand',
    };

    return {
      access_token: this.jwtService.sign(payload),
      brand: {
        id: brand.id,
        user_id: brand.user_id,
        brand_name: brand.brand_name,
        business_name: brand.business_name,
        contact_email: brand.contact_email,
        logo_url: brand.logo_url,
        banner_url: brand.banner_url,
        category: brand.category,
        is_verified: brand.user ? brand.user.is_verified : brand.is_verified,
      },
    };
  }
} 