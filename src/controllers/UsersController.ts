import User from '@models/User';
import { Response } from 'express';
import { Middleware, UserData } from 'src/core/@types';

class UsersController {
  public async show(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.loggedUser;

    try {
      const userExists = await User.findById(resUser);

      if (!userExists) {
        return response.status(404).json({ message: 'User already exists' });
      }

      const me: UserData.Me = {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        avatar: userExists.avatar,
        dateAt: {
          createdAt: userExists.get('createdAt'),
          updatedAt: userExists.get('updatedAt'),
        },
      };

      return response.json(me);
    } catch (err) {
      return response.status(400).json({ message: 'Something wrong happened, try again', error: err });
    }
  }

  public async update(request: Middleware.RequestWithUser, response: Response) {
    const idUser = request.params.id;
    const resUser = request.loggedUser;

    const { name, role, avatar } = request.body;

    try {
      if (idUser !== resUser) {
        return response.status(400).send({ massage: 'User does not check' });
      }

      const userExists = await User.findById(resUser);

      if (!userExists) {
        return response.status(404).json({ message: 'User already exists' });
      }

      const update = await User.findByIdAndUpdate(idUser, { name, role, avatar }, { new: true });

      const me: UserData.Me = {
        id: update.id,
        name: update.name,
        email: update.email,
        role: update.role,
        status: userExists.status,
        avatar: update.avatar,
        dateAt: {
          createdAt: update.get('createdAt'),
          updatedAt: userExists.get('updatedAt'),
        },
      };

      return response.status(200).json(me);
    } catch (err) {
      return response.status(400).send({ message: 'Error updating user', error: err });
    }
  }
}

export default new UsersController();
