import User from '@models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserData, USER_STATUS } from 'src/core/@types';
import JwtResources from '@resources/jwt/JwtResources';
import crypto from 'crypto';
import mailer from '@config/mailer';

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
        return response.status(401).json({
          message: 'User invalid, check.',
        });
      }

      return response.json(await JwtResources.generateToken({ id: userExists.id }));
    } catch (error) {
      return response.status(500).send({
        error: 'Registration failed',
        message: error,
      });
    }
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const userExists = await User.findOne({ email });

      if (!userExists) {
        return response.status(400).json({
          message: 'User not found',
        });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(userExists.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      });

      mailer.sendMail({
        to: email,
        from: process.env.MAIL_FROM_ADDRESS,
        template: 'auth/forgotPassword',
        subject: 'Confirmação de conta',
        context: { token },

      }, (error) => {
        if (error) {
          return response.status(400).json({ message: 'Cannot send forgot password email' });
        }
        return response.status(200).json({ message: 'Forgot Password success' });
      });
    } catch (error) {
      return response.status(400).json({ message: 'Error on forgot password, try again' });
    }
  }

  async recoveryPassword(request: Request, response: Response) {
    const { email, token, password } = request.body;

    try {
      const userExists = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

      if (!userExists) {
        return response.status(400).json({ message: 'User not found' });
      }

      if (token !== userExists.passwordResetToken) {
        return response.status(400).json({ message: 'Token invalid' });
      }

      const now = new Date();

      if (now > userExists.passwordResetExpires) {
        return response.status(400).json({ message: 'Token expires, generate a new one' });
      }

      userExists.password = password;

      await userExists.save();

      return response.status(202).json({ message: 'Password changed' });
    } catch (error) {
      return response.status(400).json({ message: 'Error recovery password, try again' });
    }
  }
}

export default new AuthController();
