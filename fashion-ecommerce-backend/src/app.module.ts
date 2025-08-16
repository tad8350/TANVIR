import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReturnsModule } from './returns/returns.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PromotionsModule } from './promotions/promotions.module';

// Import all entities
import { Address } from './common/entities/address.entity';
import { ProductImage } from './products/entities/product-image.entity';
import { Color } from './products/entities/color.entity';
import { Size } from './products/entities/size.entity';
import { Cart } from './cart/entities/cart.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { User } from './users/entities/user.entity';
import { AdminProfile } from './users/entities/admin-profile.entity';
import { BrandProfile } from './users/entities/brand-profile.entity';
import { CustomerProfile } from './users/entities/customer-profile.entity';
import { BrandLocation } from './users/entities/brand-location.entity';
import { Category } from './products/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { ProductVariant } from './products/entities/product-variant.entity';
import { Payment } from './payments/entities/payment.entity';
import { Shipment } from './shipments/entities/shipment.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { Return } from './returns/entities/return.entity';
import { Refund } from './returns/entities/refund.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationTemplate } from './notifications/entities/notification-template.entity';
import { Review } from './reviews/entities/review.entity';
import { ReviewImage } from './reviews/entities/review-image.entity';
import { PromoCode } from './promotions/entities/promo-code.entity';
import { Campaign } from './promotions/entities/campaign.entity';
import { UserPromo } from './promotions/entities/user-promo.entity';
import { BrandAnalytics } from './analytics/entities/brand-analytics.entity';
import { CustomerPreferences } from './analytics/entities/customer-preferences.entity';
import { SearchLog } from './analytics/entities/search-log.entity';
import { UserActivityLog } from './analytics/entities/user-activity-log.entity';
import { SupportTicket } from './support/entities/support-ticket.entity';
import { Referral } from './referrals/entities/referral.entity';
import { getDatabaseConfig } from './config/database.config';
import { CloudinaryService } from './common/services/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      AdminProfile,
      BrandProfile,
      CustomerProfile,
      BrandLocation,
      Address,
      Category,
      Product,
      ProductVariant,
      ProductImage,
      Color,
      Size,
      Cart,
      Order,
      OrderItem,
      Payment,
      Shipment,
      Favorite,
      Return,
      Refund,
      Notification,
      NotificationTemplate,
      Review,
      ReviewImage,
      PromoCode,
      Campaign,
      UserPromo,
      BrandAnalytics,
      CustomerPreferences,
      SearchLog,
      UserActivityLog,
      SupportTicket,
      Referral,
    ]),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    ShipmentsModule,
    FavoritesModule,
    ReturnsModule,
    NotificationsModule,
    ReviewsModule,
    PromotionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
