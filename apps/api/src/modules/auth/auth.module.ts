import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { KeycloakJwtGuard } from './keycloak-jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [KeycloakJwtGuard],
})
export class AuthModule {}
