import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, userId?: number, type?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (userId) {
      where.user_id = userId;
    }
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take: limit,
      order: { sent_at: 'DESC' },
    });

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      user_id: createNotificationDto.user_id,
      type: createNotificationDto.type,
      channel: createNotificationDto.channel,
      subject: createNotificationDto.subject,
      message: createNotificationDto.message,
      status: createNotificationDto.status,
      meta: createNotificationDto.meta,
      sent_at: new Date(),
    });
    return this.notificationRepository.save(notification);
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return this.notificationRepository.save(notification);
  }
}
