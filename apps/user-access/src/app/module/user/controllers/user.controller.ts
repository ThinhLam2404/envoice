import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { UserService } from '../services/user.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateUserTcpRequest, type UserTcpResponse } from '@common/interfaces/tcp/user';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER_ACCESS.CREATE)
  async create(@RequestParams() data: CreateUserTcpRequest, @ProcessId() processId: string): Promise<Response<string>> {
    await this.userService.create(data, processId);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.USER_ACCESS.GET_ALL)
  async getAll(): Promise<Response<UserTcpResponse[]>> {
    const result = await this.userService.getAll();
    return Response.success<UserTcpResponse[]>(result);
  }
}
