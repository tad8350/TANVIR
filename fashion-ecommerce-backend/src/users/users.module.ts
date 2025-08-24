import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BrandProfile } from './entities/brand-profile.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, BrandProfile, AdminProfile, CustomerProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {} 