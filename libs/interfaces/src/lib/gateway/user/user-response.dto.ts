import { BaseResponseDto } from '../common/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: [String] })
  role: string[];
}
