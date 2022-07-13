import { JWT_SECRET } from '@app/config';
import { ExpressRequest } from '@app/interfaces/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    console.log('authMiddleware: ', req.headers);
    const { authorization } = req.headers;
    if (!authorization) {
      req.user = null;
      next();
      return;
    }

    const [, token] = authorization.split(' ');
    console.log('token: ', token);

    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode.id);
      req.user = user;
    } catch (error) {
      req.user = null;
    } finally {
      next();
    }
  }
}
