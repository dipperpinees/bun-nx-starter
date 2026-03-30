import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose';

type AuthentikPayload = JWTPayload & {
  preferred_username?: string;
  nickname?: string;
  email?: string;
  name?: string;
  azp?: string;
  groups?: string[];
  roles?: string[];
};

@Injectable()
export class AuthentikJwtGuard implements CanActivate {
  private readonly issuer =
    process.env.AUTHENTIK_ISSUER_URL ??
    'http://localhost:9100/application/o/bun-nx/';
  private readonly clientId = process.env.AUTHENTIK_CLIENT_ID ?? 'web-client';
  private readonly discoveryUrl = `${this.issuer.replace(/\/+$/, '')}/.well-known/openid-configuration`;
  private jwksResolverPromise:
    | Promise<ReturnType<typeof createRemoteJWKSet>>
    | null = null;

  private async getJwksResolver() {
    if (!this.jwksResolverPromise) {
      this.jwksResolverPromise = (async () => {
        const response = await fetch(this.discoveryUrl);
        if (!response.ok) {
          throw new Error('Cannot load OpenID configuration');
        }

        const data = (await response.json()) as { jwks_uri?: string };
        if (!data.jwks_uri) {
          throw new Error('Missing jwks_uri in OpenID configuration');
        }

        return createRemoteJWKSet(new URL(data.jwks_uri));
      })();
    }

    return this.jwksResolverPromise;
  }

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
      const jwks = await this.getJwksResolver();
      const { payload } = await jwtVerify(token, jwks, {
        issuer: this.issuer,
        algorithms: ['RS256'],
      });

      const typedPayload = payload as AuthentikPayload;
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
