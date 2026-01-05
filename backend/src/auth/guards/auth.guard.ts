import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import User from 'src/database/entities/user/user.entity';
import AuthService from '../auth.service';

@Injectable()
export default class AuthGuard implements CanActivate {
  readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = this.extractAccessTokenFromHeader(request);
    const refreshToken = this.extractRefreshTokenFromHeader(request);
    //If not Access Token...
    if (accessToken) {
      try {
        const payload = await this.verifyToken(accessToken);

        request['user'] = payload;
        return true;
      } catch {
        this.logger.debug('Access Token Not Valid, trying with Refresh Token');
      }
    }
    //If access Token Exists...
    if (refreshToken)
      try {
        const payload = await this.verifyToken(refreshToken);
        const newAccessToken = await this.authService.regenerateAccessToken(
          payload.name,
        );
        response.cookie('jwtAccessToken', newAccessToken);
        request['user'] = payload;
        return true;
      } catch {
        this.logger.debug('Refresh Token Not valid');
      }

    throw new UnauthorizedException();
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.cookies['jwtAccessToken'] as string | undefined)?.split(' ') ??
      [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.cookies['jwtRefreshToken'] as string | undefined)?.split(' ') ??
      [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync<User>(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return payload;
  }
}
