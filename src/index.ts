import config from './config';
import { Server } from './express';
import setErrorHandlers from './config/errors/error-handler';
import registerRoutes from './routes';
import { User } from './models';

(async () => {
  const routes = await registerRoutes();
  const server = new Server(config.PORT, routes, setErrorHandlers);
  server.start();
})();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
