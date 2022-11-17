import { BlackListController } from '@controllers/BlackListController';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Middleware } from 'src/core/@types';

class AuthMiddleware extends BlackListController {
  public async middleware(request: Middleware.RequestWithUser, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: 'No token provided' });
    }

    const parts = authHeader.split(' ');

    if (!(parts.length === 2)) {
      return response.status(401).json({ message: 'Token error' });
    }

    const [schema, token] = parts;

    if (!/^Bearer$/.test(schema)) {
      return response.status(401).json({ message: 'Token malformatted' });
    }

    const revoked = await super.showTokenInBlackList(token);

    if (revoked) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.APP_SECRET, (error, decoded) => {
      if (error) {
        return response.status(401).json({ message: 'Token invalid' });
      }

      request.loggedUser = decoded.id;

      return next();
    });
  }

  public verifyToken(request: Middleware.RequestWithUser, response: Response, next: NextFunction) {
    const { token } = request.params;

    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: 'Token invalid', error: err });
      }

      request.loggedUser = decoded.id;

      return next();
    });
  }
}

export default new AuthMiddleware();
