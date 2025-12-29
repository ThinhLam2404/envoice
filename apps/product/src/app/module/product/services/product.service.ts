import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductTcpRequest): Promise<ProductTcpResponse> {
    const { sku, name } = data;
    const exists = await this.productRepository.exists(sku, name);
    if (exists) {
      throw new BadRequestException('Product already exists');
    }

    return await this.productRepository.create(data);
  }

  async getList() {
    return this.productRepository.findAll();
  }
}
