import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RoleService } from '../services/role.service';
import { RoleTcpResponse } from '@common/interfaces/tcp/role';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.ROLE.GET_ALL)
  async getAll(): Promise<Response<RoleTcpResponse[]>> {
    const result = await this.roleService.getAll();
    return Response.success<RoleTcpResponse[]>(result);
  }
}
