import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthentikJwtGuard } from './authentik-jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(AuthentikJwtGuard)
  @ApiBearerAuth('authentik')
  @ApiOperation({ summary: 'Get current authenticated user from Authentik token' })
  getMe(@Req() req: any) {
    const user = req.user ?? {};

    return {
      sub: user.sub,
      username: user.preferred_username ?? user.nickname,
      email: user.email,
      name: user.name,
      roles: user.roles ?? user.groups ?? [],
    };
  }
}
