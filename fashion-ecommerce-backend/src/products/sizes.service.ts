import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './entities/size.entity';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
  ) {}

  async findAll() {
    return this.sizeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const size = await this.sizeRepository.findOne({ where: { id } });
    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }
    return size;
  }

  async create(createSizeDto: CreateSizeDto) {
    const size = this.sizeRepository.create(createSizeDto);
    return this.sizeRepository.save(size);
  }

  async update(id: number, updateSizeDto: UpdateSizeDto) {
    const size = await this.findOne(id);
    Object.assign(size, updateSizeDto);
    return this.sizeRepository.save(size);
  }

  async remove(id: number) {
    const size = await this.findOne(id);
    await this.sizeRepository.remove(size);
    return { message: 'Size deleted successfully' };
  }
} 