import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? [
      { email: Like(`%${search}%`) },
    ] : {};

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: users,
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
    // This would create a customer profile in the customer_profiles table
    // For now, we'll just log the profile creation
    console.log(`Creating customer profile for user ${userId}:`, {
      firstName,
      lastName,
      googleId,
      picture
    });
    
    // TODO: Implement actual customer profile creation
    // This would involve creating a record in the customer_profiles table
  }
} 