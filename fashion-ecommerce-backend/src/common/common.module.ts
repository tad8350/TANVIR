import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { ImageUploadController } from './controllers/image-upload.controller';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressesController, ImageUploadController],
  providers: [AddressesService, CloudinaryService],
  exports: [TypeOrmModule, AddressesService, CloudinaryService],
})
export class CommonModule {} 