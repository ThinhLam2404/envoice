import { Module } from '@nestjs/common';
import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@common/entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [],
})
export class ProductModule {}
