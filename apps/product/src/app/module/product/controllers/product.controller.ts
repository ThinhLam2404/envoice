import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import {
  CreateProductTcpRequest,
  ProductTcpResponse,
  type UpdateProductTcpRequest,
} from '@common/interfaces/tcp/product';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import type { UpdateProductRequestDto } from '@common/interfaces/gateway/product';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() body: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(body);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST)
  async getList(): Promise<Response<ProductTcpResponse[]>> {
    const result = await this.productService.getList();
    return Response.success<ProductTcpResponse[]>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.DELETE_BY_ID)
  async deleteById(@RequestParams() id: number): Promise<Response<string>> {
    await this.productService.deleteById(id);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.UPDATE_BY_ID)
  async updateById(@RequestParams() payload: UpdateProductTcpRequest): Promise<Response<string>> {
    await this.productService.updateById(payload.id, payload);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
