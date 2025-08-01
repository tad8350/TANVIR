import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post('promo-codes')
  createPromoCode(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promotionsService.createPromoCode(createPromoCodeDto);
  }

  @Get('promo-codes')
  findAllPromoCodes(@Query() query: any) {
    return this.promotionsService.findAllPromoCodes(query);
  }

  @Get('promo-codes/:id')
  findOnePromoCode(@Param('id') id: string) {
    return this.promotionsService.findOnePromoCode(+id);
  }

  @Put('promo-codes/:id')
  updatePromoCode(@Param('id') id: string, @Body() updatePromoCodeDto: UpdatePromoCodeDto) {
    return this.promotionsService.updatePromoCode(+id, updatePromoCodeDto);
  }

  @Delete('promo-codes/:id')
  removePromoCode(@Param('id') id: string) {
    return this.promotionsService.removePromoCode(+id);
  }

  @Post('campaigns')
  createCampaign(@Body() createCampaignDto: any) {
    return this.promotionsService.createCampaign(createCampaignDto);
  }

  @Get('campaigns')
  findAllCampaigns() {
    return this.promotionsService.findAllCampaigns();
  }
} 