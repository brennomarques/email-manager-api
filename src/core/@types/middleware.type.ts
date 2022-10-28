import { Request } from 'express';
import { UserData } from './user.type';

export namespace Middleware {

  export interface RequestWithUser extends Request {
    user: UserData.UserPayload;
  }

}
