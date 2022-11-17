import { Request } from 'express';

export namespace Middleware {
  export interface RequestWithUser extends Request {
    loggedUser: string;
  }

}
