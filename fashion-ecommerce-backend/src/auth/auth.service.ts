import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminProfile } from '../users/entities/admin-profile.entity';
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
    private adminRepository: Repository<AdminProfile>
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

  async register(email: string, password: string, user_type: string) {
    // Only allow customer registration publicly
    if (user_type !== 'customer') {
      throw new ForbiddenException('Only customers can register publicly. Admin and brand users must be created by administrators.');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = await this.usersService.create({
      email,
      password,
      user_type,
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

  async setupSuperAdmin(adminData: { email: string; password: string; name: string }) {
    // Check if any admin exists
    const adminCount = await this.adminRepository.count();
    if (adminCount > 0) {
      throw new ConflictException('Super admin already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
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

  async createAdmin(adminData: { email: string; password: string; name: string }) {
    // Check if email already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
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
} 