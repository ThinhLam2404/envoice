import type { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import type { User } from '@common/schemas/user.schema';
import { ObjectId } from 'mongodb';
export const CreateUserRequestMapping = (data: CreateUserTcpRequest): Partial<User> => {
  return {
    ...data,
    roles: data.role.map((role) => new ObjectId(role)),
  };
};
