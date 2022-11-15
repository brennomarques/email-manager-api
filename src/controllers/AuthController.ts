import User from '@models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Middleware, UserData, USER_STATUS } from 'src/core/@types';
import JwtResources from '@resources/jwt/JwtResources';
import crypto from 'crypto';
import mailer from '@config/mailer';
import BlackList from '@models/BlackList';

class AuthController {
  async register(request: Request, response: Response) {
    const {
      name, email, password, role,
    } = request.body;

    const status = USER_STATUS.CONFIRM_REGISTRATION;

    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return response.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name, email, password, status, role,
      });

      const token = await JwtResources.generateToken({ id: user.id });

      mailer.sendMail({
        to: email,
        from: process.env.MAIL_FROM_ADDRESS,
        template: 'actions/welcome',
        subject: 'Bem vido(a) ao Gerenciador de e-mail! Confirmação de conta',
        context: {
          link: `${process.env.APP_URL}:${process.env.APP_PORT}/oauth/verify-account/${token.access_token}`,
          image: `${process.env.APP_URL}:${process.env.APP_PORT}/api/image`,
        },

      }, (error) => {
        if (error) {
          return response.status(400).json({ message: 'Cannot send email' });
        }

        const collection: UserData.UserPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
          createdAt: user.createdAt,
        };

        return response.status(201).json(collection);
      });
    } catch (err) {
      return response.status(500).send({
        message: 'Registration failed',
        error: err,
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
        return response.status(401).json({ message: 'Invalid username or password, check' });
      }

      return response.json(await JwtResources.generateToken({ id: userExists.id }));
    } catch (err) {
      return response.status(500).send({
        message: 'Registration failed',
        error: err,
      });
    }
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const userExists = await User.findOne({ email });

      if (!userExists) {
        return response.status(404).json({ message: 'User not found' });
      }

      const accessToken = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(userExists.id, {
        $set: {
          passwordResetToken: accessToken,
          passwordResetExpires: now,
        },
      });

      mailer.sendMail({
        to: email,
        from: process.env.MAIL_FROM_ADDRESS,
        template: 'auth/forgotPassword',
        subject: `${userExists.name}, Esqueceu sua senha?`,
        context: {
          image: `${process.env.APP_URL}:${process.env.APP_PORT}/api/image`,
          token: accessToken,
        },

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
        return response.status(404).json({ message: 'User not found' });
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

  public async logout(request: Request, response: Response) {
    const { token } = request.body;

    try {
      const idUser = await JwtResources.decodeToken(token);

      await BlackList.create({ idUser, token });

      return response.status(200).json({ revoked: true });
    } catch (err) {
      return response.status(400).json({ message: 'error invalidating token', error: err });
    }
  }

  public async verifyAccount(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.idUser;

    try {
      const userExists = await User.findById(resUser);

      if (!userExists) {
        return response.status(404).json({ message: 'User already exists' });
      }

      if (userExists.status === USER_STATUS.DISABLED) {
        return response.status(401).json({ message: 'error invalidating user, try again' });
      }

      await User.findByIdAndUpdate(userExists.id, { status: USER_STATUS.ENABLED }, { new: true });

      return response.status(302).json({ massage: 'successful invalidating user' });
    } catch (err) {
      return response.status(400).json({ message: 'error invalidating user', error: err });
    }
  }
}

export default new AuthController();
