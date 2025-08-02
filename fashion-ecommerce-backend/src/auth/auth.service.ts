import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
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

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 