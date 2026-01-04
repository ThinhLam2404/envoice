import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UserById } from '@common/interfaces/grpc/user-access';
import type { User } from '@common/schemas/user.schema';
import { Response } from '@common/interfaces/grpc/common/response.interface';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getUserByUserId')
  async getUserByUserId(params: UserById): Promise<Response<User>> {
    const result = await this.userService.getUserByUserId(params.userId);
    return Response.success<User>(result);
  }
}
