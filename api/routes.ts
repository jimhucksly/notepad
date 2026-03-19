import express, { Request, Response } from 'express';
import { get } from './router/get';
import { post } from './router/post';
import { put } from './router/put';
import { _delete } from './router/delete';
import { IApp } from './model';

const router = express.Router();

function createRouter($app: IApp) {
  get(router, $app);
  post(router, $app);
  put(router, $app);
  _delete(router, $app);
  router.get('/', (req, res) => res.send('Server API working'));
  router.get('*', (req: Request, res: Response) => {
    res.status(404).send('not found');
  });
  return router;
}

export { createRouter };
