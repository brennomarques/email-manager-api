import User from '@models/User';
import { Request, Response } from 'express';

class UsersController {
  async index(request: Request, response: Response) {
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

  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const status = 0;

    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return response.status(400).json({
          message: 'User already exists',
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        status,
      });

      return response.json(user);
    } catch (error) {
      return response.status(500).send({
        error: 'Registration failed',
        message: error,
      });
    }
  }
}

export default new UsersController();
