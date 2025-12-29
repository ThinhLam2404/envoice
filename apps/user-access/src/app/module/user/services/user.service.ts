import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import type { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserRequestMapping } from '../mappers';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(params: CreateUserTcpRequest) {
    const exists = await this.userRepository.exist(params.email);
    if (exists) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }
    const input = CreateUserRequestMapping(params);
    return this.userRepository.create(input);
  }

  async getAll() {
    return this.userRepository.getAll();
  }
}
