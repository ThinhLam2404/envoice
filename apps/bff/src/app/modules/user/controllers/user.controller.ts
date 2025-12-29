import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateUserRequestDto, type UserResponseDto } from '@common/interfaces/gateway/user';
import { map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateUserTcpRequest, type UserTcpResponse } from '@common/interfaces/tcp/user';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER_ACCESS.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<UserResponseDto[]> })
  @ApiOperation({ summary: 'Get all users' })
  getAll(@ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserTcpResponse[]>(TCP_REQUEST_MESSAGE.USER_ACCESS.GET_ALL, { processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
