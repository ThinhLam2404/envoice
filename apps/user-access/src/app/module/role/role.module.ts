import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDestination } from '@common/schemas/role.schema';
import { RoleService } from './services/role.service';
import { RoleRepository } from './repositories/role.repository';
import { MongoProvider } from '@common/configuration/mongo.config';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([RoleDestination])],
  controllers: [],
  providers: [RoleService, RoleRepository],
  exports: [],
})
export class RoleModule {}
