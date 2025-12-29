import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, type TConfiguration } from '../configuration';
import { RoleModule } from './module/role/role.module';
import { MongoProvider } from '@common/configuration/mongo.config';
import { UserModule } from './module/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    MongoProvider,
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
