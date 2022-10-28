import User from '@models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserData, USER_STATUS } from 'src/core/@types';

class AuthController {
  async register(request: Request, response: Response) {
    const {
      name, email, password, role,
    } = request.body;

    const status = USER_STATUS.CONFIRM_REGISTRATION;

    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return response.status(400).json({
          message: 'User already exists',
        });
      }

      const user = await User.create({
        name, email, password, status, role,
      });

      const collection: UserData.UserPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
      };

      return response.json(collection);
    } catch (error) {
      return response.status(500).send({
        error: 'Registration failed',
        message: error,
      });
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const userExists = await User.findOne({ email }).select('+password');

      if (!userExists) {
        return response.status(400).json({
          message: 'User not found',
        });
      }

      if (userExists.status === USER_STATUS.CONFIRM_REGISTRATION) {
        return response.status(401).json({
          message: 'Unconfirmed user',
        });
      }

      if (userExists.status === USER_STATUS.DISABLED) {
        return response.status(401).json({
          message: 'Account disabled, contact support',
        });
      }

      if (!await bcrypt.compare(password, userExists.password)) {
        return response.status(400).json({
          message: 'User invalid, check.',
        });
      }

      const token = jwt.sign({ id: userExists.id }, process.env.SECRET, { expiresIn: 86400 });

      return response.json({ token_type: 'Bearer', expires_in: 86400, access_token: token });
    } catch (error) {
      return response.status(500).send({
        error: 'Registration failed',
        message: error,
      });
    }
  }
}

export default new AuthController();
