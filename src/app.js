import express from 'express';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.serve = express();
        this.middleware();
        this.routes();
        this.errorHandler();
    }

    middleware() {
        this.serve.use(express.json());
    }

    routes() {
        this.serve.use(routes);
    }

    errorHandler() {
        this.serve.use((err, req, res, next) =>
            res.status(err.status || 500).json({ message: err.error })
        );
    }
}

export default new App().serve;
