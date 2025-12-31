import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import type { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingResponseDto, LoggingRequestDto } from '@common/interfaces/gateway/authorizer';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoggingTcpResponse, LoggingTcpRequest } from '@common/interfaces/tcp/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
@Controller('Authorizer')
@ApiTags('authorizer')
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<LoggingResponseDto> })
  @ApiOperation({ summary: 'Logging with username and password' })
  login(@Body() body: LoggingRequestDto, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoggingTcpResponse, LoggingTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
