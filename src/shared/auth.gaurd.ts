import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      return false;
    }

    req.user = await this.validateToken(req.headers.authorization);

    return true;
  }

  async validateToken(auth: string) {
    console.log('Raw Authorization Header:', auth); // 👈 log the token

    if (!auth) {
      throw new HttpException('No authorization header', HttpStatus.FORBIDDEN);
    }

    const parts = auth.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException('Invalid token format', HttpStatus.FORBIDDEN);
    }

    const token = parts[1];

    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      console.error('JWT verify error:', err); // 👈 show detailed error
      throw new HttpException(
        'Token error: ' + (err.message || err.name),
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
