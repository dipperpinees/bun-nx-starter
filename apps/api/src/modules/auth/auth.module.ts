import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthentikJwtGuard } from './authentik-jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthentikJwtGuard],
})
export class AuthModule {}
