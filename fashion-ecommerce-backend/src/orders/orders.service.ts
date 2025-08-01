import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getUserOrders(userId: number, page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { user: { id: userId } };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['order_items', 'order_items.product_variant'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['user', 'order_items', 'order_items.product_variant'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['order_items', 'order_items.product_variant'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create({
      user: { id: userId },
      status: 'pending',
      payment_status: 'pending',
      total_amount: 0,
    });

    const savedOrder = await this.orderRepository.save(order);

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const orderItem = this.orderItemRepository.create({
        order: { id: savedOrder.id },
        product_variant: { id: item.product_variant_id },
        quantity: item.quantity,
        price: 0, // This should be fetched from product variant
      });
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);

    // Update total amount
    savedOrder.total_amount = totalAmount;
    return this.orderRepository.save(savedOrder);
  }

  async updateOrderStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    return this.orderRepository.save(order);
  }
} 