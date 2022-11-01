import { Request } from 'express';

export namespace Middleware {
  export interface RequestWithUser extends Request {
    idUser: string;
  }

}
