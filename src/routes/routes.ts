import AuthController from '@controllers/AuthController';
import UsersController from '@controllers/UsersController';
import express, { Router } from 'express';
import path from 'path';
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

// Get image for use in API
routes.use('/image', express.static(path.resolve('./src/public/assets')));

export default routes;
