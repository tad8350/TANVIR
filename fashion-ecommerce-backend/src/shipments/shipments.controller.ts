import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto, UpdateShipmentDto, ShipmentResponseDto } from './dto/shipment.dto';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shipments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'order_id', required: false, description: 'Order ID', example: 1 })
  @ApiQuery({ name: 'status', required: false, description: 'Shipment status', example: 'delivered' })
  @ApiResponse({ status: 200, description: 'List of shipments', type: [ShipmentResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('order_id') orderId?: number,
    @Query('status') status?: string,
  ) {
    return this.shipmentsService.findAll(page, limit, orderId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({ name: 'id', description: 'Shipment ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Shipment details', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  async findOne(@Param('id') id: number) {
    return this.shipmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, description: 'Shipment created successfully', type: ShipmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.create(createShipmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  async update(@Param('id') id: number, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentsService.update(id, updateShipmentDto);
  }
} 