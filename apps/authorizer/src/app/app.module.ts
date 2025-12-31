import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, type TConfiguration } from '../configuration';
import { KeycloakModule } from './module/keycloak/keycloak.module';
import { AuthorizerModule } from './module/authorizer/authorizer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), KeycloakModule, AuthorizerModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
