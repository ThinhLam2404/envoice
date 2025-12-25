import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class ClientRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

class ItemRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  vatRate: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateInvoiceRequestDto {
  @ApiProperty({ type: ClientRequestDto })
  @IsNotEmpty()
  @ValidateNested() //dùng khi nested object
  @Type(() => ClientRequestDto) //Transform nested object → class
  client: ClientRequestDto;

  @ApiProperty({ type: [ItemRequestDto] })
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) //dùng khi nested object
  @Type(() => ItemRequestDto) //Transform nested object → class
  items: ItemRequestDto[];
}
