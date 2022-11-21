import AuthController from '@controllers/AuthController';
import ContactController from '@controllers/ContactController';
import UsersController from '@controllers/UsersController';
import express, { Router } from 'express';
import path from 'path';
import AuthMiddleware from './AuthMiddleware';

const routes = Router();

// Auth'
routes.post('/oauth', AuthController.login);
routes.post('/oauth/register', AuthController.register);
routes.post('/oauth/forgot-password', AuthController.forgotPassword);
routes.post('/oauth/recovery-password', AuthController.recoveryPassword);
routes.post('/oauth/logout', AuthController.logout);
routes.post('/oauth/verify-account/:token', AuthMiddleware.verifyToken, AuthController.verifyAccount);

// User route
routes.get('/user', AuthMiddleware.middleware, UsersController.show);
routes.put('/user/:id', AuthMiddleware.middleware, UsersController.update);

// Contacts
routes.get('/contact', AuthMiddleware.middleware, ContactController.index);
routes.get('/contact/:id', AuthMiddleware.middleware, ContactController.show);
routes.post('/contact', AuthMiddleware.middleware, ContactController.store);
routes.put('/contact/:id', AuthMiddleware.middleware, ContactController.update);
routes.delete('/contact/:id', AuthMiddleware.middleware, ContactController.destroy);

// Get image for use in API
routes.use('/image', express.static(path.resolve('./src/public/assets')));

export default routes;
