import AuthController from '@controllers/AuthController';
import UsersController from '@controllers/UsersController';
import { Router } from 'express';
import { authMiddleware, verifyToken } from './auth.middleware';

const routes = Router();

// Auth
routes.post('/oauth', AuthController.login);
routes.post('/oauth/register', AuthController.register);
routes.post('/oauth/forgot-password', AuthController.forgotPassword);
routes.post('/oauth/recovery-password', AuthController.recoveryPassword);
routes.post('/oauth/revoke', AuthController.logout);
routes.post('/oauth/verify-account/:token', verifyToken, AuthController.verifyAccount);

// User route
routes.get('/user', authMiddleware, UsersController.show);
routes.put('/user/:id', authMiddleware, UsersController.update);

export default routes;
