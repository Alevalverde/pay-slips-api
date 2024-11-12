import config from './config';
// eslint-disable-next-line import/order
import { cacheService } from 'qsocialnow-common';
import { Server } from './express';
import setErrorHandlers from './config/errors/error-handler';
import registerRoutes from './routes';

(async () => {
  const routes = await registerRoutes();
  const server = new Server(config.PORT, routes, setErrorHandlers);
  cacheService.connect();
  server.start();
})();
