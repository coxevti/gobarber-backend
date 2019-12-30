import express, { Router } from 'express';
import { resolve } from 'path';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/authMiddleware';
import multerConfig from './config/multer';

import userStoreValidation from './app/validations/userStore';
import userUpdateValidation from './app/validations/userUpdate';
import sessionStoreValidation from './app/validations/sessionStore';
import appointmentStoreValidation from './app/validations/appointmentStore';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userStoreValidation, UserController.store);
routes.post('/sessions', sessionStoreValidation, SessionController.store);

routes.use(authMiddleware);

routes.get('/providers', ProviderController.index);
routes.get('/appointments', AppointmentController.index);
routes.get('/schedule', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.post(
    '/appointments',
    appointmentStoreValidation,
    AppointmentController.store
);
routes.post('/files', upload.single('file'), FileController.store);
routes.put('/users', userUpdateValidation, UserController.update);

routes.use(
    '/files',
    express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
);

export default routes;
