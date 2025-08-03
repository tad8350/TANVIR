import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SizesService } from './sizes.service';
import { CreateSizeDto, UpdateSizeDto, SizeResponseDto } from './dto/size.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponse({ status: 200, description: 'List of sizes', type: [SizeResponseDto] })
  async findAll() {
    return this.sizesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get size by ID' })
  @ApiParam({ name: 'id', description: 'Size ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Size details', type: SizeResponseDto })
  @ApiResponse({ status: 404, description: 'Size not found' })
  async findOne(@Param('id') id: number) {
    return this.sizesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, description: 'Size created successfully', type: SizeResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update size' })
  @ApiParam({ name: 'id', description: 'Size ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Size updated successfully', type: SizeResponseDto })
  @ApiResponse({ status: 404, description: 'Size not found' })
  async update(@Param('id') id: number, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(id, updateSizeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete size' })
  @ApiParam({ name: 'id', description: 'Size ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Size deleted successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  async remove(@Param('id') id: number) {
    return this.sizesService.remove(id);
  }
} 