import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.serve = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.serve.use(express.json());
  }

  routes() {
    this.serve.use(routes);
  }
}

export default new App().serve;
