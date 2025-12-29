import { BaseSchema, createSchema } from './base.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import type { Model } from 'mongoose';
@Schema({
  timestamps: true,
  collection: 'user',
})
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;
  @Prop({ type: String })
  lastName: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  userId: string; //lưu id của keycloak
  @Prop({ type: [ObjectId], ref: 'Role' })
  roles: ObjectId[];
}
export const UserSchema = createSchema(User);

export const UserModelName = User.name;

export const UserDestination = { name: UserModelName, schema: UserSchema };

export type UserModel = Model<User>;
