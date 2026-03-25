import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose';

type KeycloakPayload = JWTPayload & {
  preferred_username?: string;
  email?: string;
  name?: string;
  azp?: string;
  realm_access?: {
    roles?: string[];
  };
};

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  private readonly keycloakUrl =
    process.env.KEYCLOAK_URL ?? 'http://localhost:8080';
  private readonly realm = process.env.KEYCLOAK_REALM ?? 'bun-nx';
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID ?? 'web-client';
  private readonly issuer = `${this.keycloakUrl}/realms/${this.realm}`;
  private readonly jwks = createRemoteJWKSet(
    new URL(`${this.issuer}/protocol/openid-connect/certs`),
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        algorithms: ['RS256'],
      });

      const typedPayload = payload as KeycloakPayload;
      const aud = typedPayload.aud;
      const hasAudience = Array.isArray(aud)
        ? aud.includes(this.clientId)
        : aud === this.clientId;

      if (!hasAudience && typedPayload.azp !== this.clientId) {
        throw new UnauthorizedException('Token is not issued for this client');
      }

      request.user = typedPayload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
