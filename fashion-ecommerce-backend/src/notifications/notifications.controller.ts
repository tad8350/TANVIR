import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto, NotificationResponseDto } from './dto/notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'user_id', required: false, description: 'User ID', example: 1 })
  @ApiQuery({ name: 'type', required: false, description: 'Notification type', example: 'order_update' })
  @ApiQuery({ name: 'status', required: false, description: 'Notification status', example: 'sent' })
  @ApiResponse({ status: 200, description: 'List of notifications', type: [NotificationResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('user_id') userId?: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.notificationsService.findAll(page, limit, userId, type, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Notification details', type: NotificationResponseDto })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: number) {
    return this.notificationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully', type: NotificationResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification status' })
  @ApiParam({ name: 'id', description: 'Notification ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Notification updated successfully', type: NotificationResponseDto })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async update(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }
} 