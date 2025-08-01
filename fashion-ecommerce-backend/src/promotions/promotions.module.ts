import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromoCode } from './entities/promo-code.entity';
import { Campaign } from './entities/campaign.entity';
import { UserPromo } from './entities/user-promo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, Campaign, UserPromo])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {} 