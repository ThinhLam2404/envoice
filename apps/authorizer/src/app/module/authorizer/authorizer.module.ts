import { Module } from '@nestjs/common';
import { AuthorizerService } from './services/authorizer.service';
import { AuthorizerController } from './controllers/authorizer.controller';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  controllers: [AuthorizerController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
