import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { Campaign } from './entities/campaign.entity';
import { UserPromo } from './entities/user-promo.entity';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepository: Repository<PromoCode>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(UserPromo)
    private userPromoRepository: Repository<UserPromo>,
  ) {}

  createPromoCode(createPromoCodeDto: CreatePromoCodeDto) {
    const promoCode = this.promoCodeRepository.create(createPromoCodeDto);
    return this.promoCodeRepository.save(promoCode);
  }

  findAllPromoCodes(query: any) {
    return this.promoCodeRepository.find({
      where: query,
      relations: ['brand', 'campaign'],
    });
  }

  findOnePromoCode(id: number) {
    return this.promoCodeRepository.findOne({
      where: { id },
      relations: ['brand', 'campaign'],
    });
  }

  updatePromoCode(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    return this.promoCodeRepository.update(id, updatePromoCodeDto);
  }

  removePromoCode(id: number) {
    return this.promoCodeRepository.delete(id);
  }

  createCampaign(createCampaignDto: any) {
    const campaign = this.campaignRepository.create(createCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  findAllCampaigns() {
    return this.campaignRepository.find({
      relations: ['promoCodes'],
    });
  }
} 