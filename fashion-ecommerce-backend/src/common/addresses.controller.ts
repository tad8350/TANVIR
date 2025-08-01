import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto, AddressResponseDto } from './dto/address.dto';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all addresses' })
  @ApiQuery({ name: 'user_id', required: false, description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of addresses', type: [AddressResponseDto] })
  async findAll(@Query('user_id') userId?: number) {
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Address details', type: AddressResponseDto })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async findOne(@Param('id') id: number) {
    return this.addressesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully', type: AddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Address updated successfully', type: AddressResponseDto })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async update(@Param('id') id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(@Param('id') id: number) {
    return this.addressesService.remove(id);
  }
} 