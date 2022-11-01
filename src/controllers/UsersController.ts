import User from '@models/User';
import { Request, Response } from 'express';
import { Middleware } from 'src/core/@types';

class UsersController {
  public async show(request: Request, response: Response) {
    try {
      const users = await User.find();
      return response.json(users);
    } catch (error) {
      return response.status(500).send({
        error: 'Something wrong happened, try again',
        message: error,
      });
    }
  }

  public async update(request: Middleware.RequestWithUser, response: Response) {
    const idUser = request.params.id;
    const resUser = request.idUser;

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

      return response.status(200).json(update);
    } catch (err) {
      return response.status(400).send({ message: 'Error updating user', error: err });
    }
  }
}

export default new UsersController();
