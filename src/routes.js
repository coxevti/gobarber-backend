import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/authMiddleware';
import multerConfig from './config/multer';

import userStoreValidation from './app/validations/userStore';
import userUpdateValidation from './app/validations/userUpdate';
import sessionStoreValidation from './app/validations/sessionStore';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userStoreValidation, UserController.store);
routes.post('/sessions', sessionStoreValidation, SessionController.store);

routes.use(authMiddleware);

routes.put('/users', userUpdateValidation, UserController.update);
routes.post('/files', upload.single('file'), (req, res) => {
    res.json({ message: 'ok' });
});

export default routes;
