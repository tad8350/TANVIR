import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async findAll() {
    return this.colorRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async create(createColorDto: CreateColorDto) {
    const color = this.colorRepository.create(createColorDto);
    return this.colorRepository.save(color);
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    const color = await this.findOne(id);
    Object.assign(color, updateColorDto);
    return this.colorRepository.save(color);
  }

  async remove(id: number) {
    const color = await this.findOne(id);
    await this.colorRepository.remove(color);
    return { message: 'Color deleted successfully' };
  }
} 