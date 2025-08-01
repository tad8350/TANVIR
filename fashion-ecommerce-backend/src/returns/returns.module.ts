import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Return } from './entities/return.entity';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';

@Module({
  imports: [TypeOrmModule.forFeature([Return])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [TypeOrmModule, ReturnsService],
})
export class ReturnsModule {}
