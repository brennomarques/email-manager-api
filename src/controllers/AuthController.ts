import User from '@models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Middleware, UserData, USER_STATUS } from 'src/core/@types';
import JwtResources from '@resources/jwt/JwtResources';
import crypto from 'crypto';
import mailer from '@config/mailer';
import { BlackListController } from './BlackListController';

class AuthController extends BlackListController {
  async register(request: Request, response: Response) {
    const payload: UserData.FormPayload = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      role: request.body.role,
    };

    try {
      if (!(payload.name && payload.email && payload.password)) {
        return response.status(400).json({ message: 'Required field', error: ['name', 'email', 'password'] });
      }

      const userExists = await User.findOne({ email: payload.email });

      if (userExists) {
        return response.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name: payload.name, email: payload.email, password: payload.password, role: payload.role,
      });

      const token = await JwtResources.generateToken({ id: user.id });

      mailer.sendMail({
        to: payload.email,
        from: process.env.MAIL_FROM_ADDRESS,
        template: 'auth/welcome',
        subject: 'Bem vido(a) ao Gerenciador de e-mail! Confirmação de conta',
        context: {
          link: `${process.env.APP_URL}:${process.env.APP_PORT}/oauth/verify-account/${token.access_token}`,
          image: `${process.env.APP_URL}:${process.env.APP_PORT}/api/image`,
        },

      }, (error) => {
        if (error) {
          return response.status(400).json({ message: 'Cannot send email' });
        }

        const collection: UserData.Me = {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
          dateAt: {
            createdAt: user.get('createdAt'),
            updatedAt: user.get('updatedAt'),
          },
        };

        return response.status(201).json(collection);
      });
    } catch (err) {
      return response.status(500).send({
        message: 'Error creating new register',
        error: err,
      });
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      if (!(email && password)) {
        return response.status(400).json({ message: 'Required field', error: ['email', 'password'] });
      }

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
        return response.status(401).json({ message: 'Invalid username and password combination' });
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
      if (!(email)) {
        return response.status(400).json({ message: 'Required field', error: ['email'] });
      }

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
        return response.status(200).json({ message: 'Email send forgot password' });
      });
    } catch (error) {
      return response.status(400).json({ message: 'Error on forgot password, try again' });
    }
  }

  async recoveryPassword(request: Request, response: Response) {
    const { email, password, token } = request.body;

    try {
      if (!(email && password && token)) {
        return response.status(400).json({ message: 'Required field', error: ['email', 'password', 'token'] });
      }

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
      if (!(token)) {
        return response.status(400).json({ message: 'Required field', error: ['token'] });
      }

      const revoked = await super.storeInBlackList(token);

      return response.status(200).json(revoked);
    } catch (err) {
      return response.status(400).json({ message: 'error invalidating token', error: err });
    }
  }

  public async verifyAccount(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.loggedUser;

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
