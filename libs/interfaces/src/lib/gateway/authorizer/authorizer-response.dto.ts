import { ApiProperty } from '@nestjs/swagger';

export class LoggingResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
