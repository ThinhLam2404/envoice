import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from '@common/interfaces/gateway/product';
import { ProcessId } from '@common/decorators/processId.decorator';
import {
  CreateProductTcpRequest,
  ProductTcpResponse,
  type UpdateProductTcpRequest,
} from '@common/interfaces/tcp/product';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, CreateProductTcpRequest>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto[]> })
  @ApiOperation({ summary: 'Get all products' })
  getList(@ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse[]>(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST, { processId })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Delete product by id' })
  deleteById(@ProcessId() processId: string, @Param('id') id: number) {
    return this.productClient
      .send<string>(TCP_REQUEST_MESSAGE.PRODUCT.DELETE_BY_ID, { processId, data: { id } })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Patch(':id')
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Update product by id' })
  @ApiBody({ type: UpdateProductRequestDto })
  updateById(@ProcessId() processId: string, @Param('id') id: number, @Body() body: UpdateProductRequestDto) {
    return this.productClient
      .send<string, UpdateProductTcpRequest>(TCP_REQUEST_MESSAGE.PRODUCT.UPDATE_BY_ID, {
        processId,
        data: { id, ...body },
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
