import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto, UpdateReturnDto, ReturnResponseDto } from './dto/return.dto';

@ApiTags('Returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all returns' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'status', required: false, description: 'Return status', example: 'pending' })
  @ApiQuery({ name: 'order_id', required: false, description: 'Order ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of returns', type: [ReturnResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('order_id') orderId?: number,
  ) {
    return this.returnsService.findAll(page, limit, status, orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return by ID' })
  @ApiParam({ name: 'id', description: 'Return ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Return details', type: ReturnResponseDto })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async findOne(@Param('id') id: number) {
    return this.returnsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new return request' })
  @ApiResponse({ status: 201, description: 'Return request created successfully', type: ReturnResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.create(createReturnDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update return status' })
  @ApiParam({ name: 'id', description: 'Return ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Return updated successfully', type: ReturnResponseDto })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async update(@Param('id') id: number, @Body() updateReturnDto: UpdateReturnDto) {
    return this.returnsService.update(id, updateReturnDto);
  }
}
