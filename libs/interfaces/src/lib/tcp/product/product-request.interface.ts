import { CreateProductRequestDto, UpdateProductRequestDto } from '../../gateway/product';
export type CreateProductTcpRequest = CreateProductRequestDto;
export type UpdateProductTcpRequest = { id: number } & UpdateProductRequestDto;
