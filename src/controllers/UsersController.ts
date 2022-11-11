import User from '@models/User';
import { Response } from 'express';
import { Middleware } from 'src/core/@types';

class UsersController {
  public async show(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.idUser;

    try {
      const userExists = await User.findById(resUser);

      if (!userExists) {
        return response.status(404).json({ message: 'User already exists' });
      }

      return response.json(userExists);
    } catch (err) {
      return response.status(400).json({ message: 'Something wrong happened, try again', error: err });
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
