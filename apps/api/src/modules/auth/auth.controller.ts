import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeycloakJwtGuard } from './keycloak-jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(KeycloakJwtGuard)
  @ApiBearerAuth('keycloak')
  @ApiOperation({ summary: 'Get current authenticated user from Keycloak token' })
  getMe(@Req() req: any) {
    const user = req.user ?? {};

    return {
      sub: user.sub,
      username: user.preferred_username,
      email: user.email,
      name: user.name,
      roles: user.realm_access?.roles ?? [],
    };
  }
}
