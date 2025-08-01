import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
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
    
    const [payments, total] = await this.paymentRepository.findAndCount({
      where,
      relations: ['order'],
      skip,
      take: limit,
      order: { paid_at: 'DESC' },
    });

    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create({
      order_id: createPaymentDto.order_id,
      method: createPaymentDto.method,
      status: createPaymentDto.status,
      transaction_id: createPaymentDto.transaction_id,
      paid_at: new Date(),
    });
    return this.paymentRepository.save(payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }
} 