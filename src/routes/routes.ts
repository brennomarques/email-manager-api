import AuthController from '@controllers/AuthController';
import UsersController from '@controllers/UsersController';
import { Router } from 'express';
import { authMiddleware } from './auth.middleware';

const routes = Router();

// Auth
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

// User route
routes.get('/user', authMiddleware, UsersController.index);
routes.post('/user', UsersController.store);

export default routes;
