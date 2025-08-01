import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Return } from './entities/return.entity';
import { CreateReturnDto, UpdateReturnDto } from './dto/return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, status?: string, orderId?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    if (orderId) {
      where.order_id = orderId;
    }
    
    const [returns, total] = await this.returnRepository.findAndCount({
      where,
      relations: ['order', 'order_item'],
      skip,
      take: limit,
      order: { requested_at: 'DESC' },
    });

    return {
      data: returns,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const returnItem = await this.returnRepository.findOne({
      where: { id },
      relations: ['order', 'order_item'],
    });
    if (!returnItem) {
      throw new NotFoundException(`Return with ID ${id} not found`);
    }
    return returnItem;
  }

  async create(createReturnDto: CreateReturnDto) {
    const returnItem = this.returnRepository.create({
      order_id: createReturnDto.order_id,
      order_item_id: createReturnDto.order_item_id,
      status: createReturnDto.status,
      reason: createReturnDto.reason,
      refund_status: createReturnDto.refund_status,
      requested_at: new Date(),
    });
    return this.returnRepository.save(returnItem);
  }

  async update(id: number, updateReturnDto: UpdateReturnDto) {
    const returnItem = await this.findOne(id);
    Object.assign(returnItem, updateReturnDto);
    returnItem.updated_at = new Date();
    return this.returnRepository.save(returnItem);
  }
} 