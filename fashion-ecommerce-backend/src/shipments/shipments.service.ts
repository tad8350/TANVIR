import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, orderId?: number, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (orderId) {
      where.order_id = orderId;
    }
    if (status) {
      where.status = status;
    }
    
    const [shipments, total] = await this.shipmentRepository.findAndCount({
      where,
      relations: ['order'],
      skip,
      take: limit,
      order: { shipped_at: 'DESC' },
    });

    return {
      data: shipments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return shipment;
  }

  async create(createShipmentDto: CreateShipmentDto) {
    const shipment = this.shipmentRepository.create({
      order_id: createShipmentDto.order_id,
      courier_name: createShipmentDto.courier_name,
      tracking_number: createShipmentDto.tracking_number,
      status: createShipmentDto.status,
      shipped_at: new Date(),
    });
    return this.shipmentRepository.save(shipment);
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.findOne(id);
    Object.assign(shipment, updateShipmentDto);
    
    if (updateShipmentDto.status === 'delivered') {
      shipment.delivered_at = new Date();
    }
    
    return this.shipmentRepository.save(shipment);
  }
} 