import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async findAll(userId?: number) {
    const where: any = {};
    if (userId) {
      where.user_id = userId;
    }
    
    return this.addressRepository.find({
      where,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async create(createAddressDto: CreateAddressDto) {
    const address = this.addressRepository.create({
      user_id: createAddressDto.user_id,
      name: createAddressDto.name,
      phone: createAddressDto.phone,
      address_line: createAddressDto.address_line,
      city: createAddressDto.city,
      postal_code: createAddressDto.postal_code,
      type: createAddressDto.type,
    });
    return this.addressRepository.save(address);
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
    return { message: 'Address deleted successfully' };
  }
} 