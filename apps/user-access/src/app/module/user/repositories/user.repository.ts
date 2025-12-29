import { UserModelName, type User, type UserModel } from '@common/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: UserModel) {}
  create(data: Partial<User>) {
    return this.userModel.create(data);
  }
  getAll() {
    return this.userModel.find().exec();
  }
  getById(id: string) {
    return this.userModel.findById(id).exec();
  }
  getByUserId(userId: string) {
    return this.userModel.findOne({ userId }).populate('roles').exec();
  }
  getByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
  async exist(email: string) {
    const result = await this.userModel.findOne({ email }).exec();
    return !!result;
  }
  a;
}
