import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/authMiddleware';

import userStoreValidation from './app/validations/userStore';
import userUpdateValidation from './app/validations/userUpdate';
import sessionStoreValidation from './app/validations/sessionStore';

const routes = new Router();

routes.post('/users', userStoreValidation, UserController.store);
routes.post('/sessions', sessionStoreValidation, SessionController.store);

routes.use(authMiddleware);

routes.put('/users', userUpdateValidation, UserController.update);

export default routes;
