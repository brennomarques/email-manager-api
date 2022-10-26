import UsersController from '@controllers/UsersController';
import { Router } from 'express';

const routes = Router();

// User route
routes.get('/user', UsersController.index);
routes.post('/user', UsersController.store);

export default routes;
