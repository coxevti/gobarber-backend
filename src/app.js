import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';

import sentryConfig from './config/sentry';
import './database';

class App {
    constructor() {
        this.serve = express();
        Sentry.init(sentryConfig);
        this.middleware();
        this.routes();
        this.errorHandler();
    }

    middleware() {
        this.serve.use(Sentry.Handlers.requestHandler());
        this.serve.use(cors());
        this.serve.use(express.json());
    }

    routes() {
        this.serve.use(routes);
        this.serve.use(Sentry.Handlers.errorHandler());
    }

    errorHandler() {
        this.serve.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
            return res.status(500).json({ message: 'Internal server error' });
        });
    }
}

export default new App().serve;
