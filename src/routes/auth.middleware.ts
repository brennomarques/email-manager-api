import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Middleware } from 'src/core/@types';

export function authMiddleware(request: Middleware.RequestWithUser, response: Response, next: NextFunction) {
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

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({ message: 'Token invalid' });
    }

    request.idUser = decoded.id;

    return next();
  });
}
