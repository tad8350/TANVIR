import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { BrandProfile } from '../users/entities/brand-profile.entity';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductImage,
      BrandProfile,
      User,
      Category,
      Color,
      Size,
    ]),
  ],
  controllers: [
    ProductsController, 
    BrandsController, 
    CategoriesController,
    ProductVariantsController,
    ProductImagesController,
    ColorsController,
    SizesController,
  ],
  providers: [
    ProductsService, 
    BrandsService, 
    CategoriesService,
    ProductVariantsService,
    ProductImagesService,
    ColorsService,
    SizesService,
  ],
  exports: [
    TypeOrmModule, 
    ProductsService, 
    BrandsService, 
    CategoriesService,
    ProductVariantsService,
    ProductImagesService,
    ColorsService,
    SizesService,
  ],
})
export class ProductsModule {} 