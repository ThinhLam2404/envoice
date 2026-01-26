import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import type { UpdateProductRequestDto } from '@common/interfaces/gateway/product';
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

  async deleteById(id: number) {
    return this.productRepository.remove(id);
  }

  async updateById(id: number, data: UpdateProductRequestDto) {
    return this.productRepository.update(id, data);
  }
}
