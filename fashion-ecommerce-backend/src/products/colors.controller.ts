import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ColorsService } from './colors.service';
import { CreateColorDto, UpdateColorDto, ColorResponseDto } from './dto/color.dto';

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  @ApiResponse({ status: 200, description: 'List of colors', type: [ColorResponseDto] })
  async findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get color by ID' })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Color details', type: ColorResponseDto })
  @ApiResponse({ status: 404, description: 'Color not found' })
  async findOne(@Param('id') id: number) {
    return this.colorsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new color' })
  @ApiResponse({ status: 201, description: 'Color created successfully', type: ColorResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update color' })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Color updated successfully', type: ColorResponseDto })
  @ApiResponse({ status: 404, description: 'Color not found' })
  async update(@Param('id') id: number, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete color' })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Color deleted successfully' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  async remove(@Param('id') id: number) {
    return this.colorsService.remove(id);
  }
} 