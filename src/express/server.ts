import compression from 'compression';
import express, { Express, Router } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { middleware } from 'express-openapi-validator';
import { errorLogger, logger as loggerMiddleware } from 'express-winston';
import util from 'util';
import process from 'process';
import config from '@/config';
import { logger } from '@/utils';

interface NodeServer {
  /**
   * Starts the server.
   */
  start(): void;

  /**
   * Stops the server with an optional exit code.
   * @param exitCode - The exit code (default is 0).
   */
  stop(exitCode?: number): void;

  /**
   * Performs cleanup tasks before exiting the server for a graceful shutdown.
   */
  cleanup(): void;
}

export default class Server implements NodeServer {
  private app: Express;

  private server: http.Server;

  /**
   * Constructs the Server instance.
   * @param port - The port on which the server should listen.
   * @param routes - An array of Express Routers for defining routes.
   * @param setErrorHandlers - A function to set error handlers for the Express app.
   */
  constructor(
    private readonly port: number,
    private readonly routes: Router[],
    private readonly setErrorHandlers: (app: Express) => void
  ) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.setServerConfig();
    this.setListeners();
  }

  /**
   * Starts the server and listens on the specified port.
   */
  start(): void {
    this.server.listen(this.port, () => {
      logger.info(`⚡ Listening on ${this.port}`);
    });
  }

  /**
   * Stops the server and performs cleanup before exiting.
   * @param exitCode - The exit code (default is 0).
   */
  stop(exitCode = 0): void {
    logger.info(`Stopping server. Waiting for connections to end...`);
    this.server.close(() => {
      logger.info(`Server closed successfully`);
      //! Implement "cleanup" method for additional cleanup tasks, e.g. closing DB connections
      // this.cleanup();
      process.exit(exitCode);
    });
  }

  /**
   * Configures settings and middlewares for the Express server.
   */
  setServerConfig(): void {
    // Set port and trust proxy
    this.app.set('port', this.port);
    this.app.set('trust proxy', 1);

    // Use security-related middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    // Enable compression and CORS
    this.app.use(compression());
    this.app.use(cors());

    // Parse JSON and URL-encoded requests
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    // Use logging middleware
    this.app.use(
      loggerMiddleware({
        winstonInstance: logger,
        expressFormat: true,
        colorize: true,
        meta: false,
      })
    );

    // Validate requests against defined OpenApi spec
    this.app.use(
      middleware({
        apiSpec: config.DIR_SWAGGER || '',
        validateResponses: false,
        validateRequests: true,
        validateSecurity: false,
      })
    );

    // Serve Swagger UI in non-production environments
    if (config.NODE_ENV !== 'production') {
      const swaggerDocument = YAML.load(config.DIR_SWAGGER || '');
      if (config.BASE_DOMAIN) {
        swaggerDocument.servers = [
          {
            url: config.BASE_DOMAIN,
            description: 'url in enviroment cloud',
          },
          ...swaggerDocument.servers,
        ];
      }
      this.app.use(config.DOCS_ENDPOINT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    // Set API routes prefix and error handling
    this.app.use(config.BASE_URL, this.routes);
    this.app.use(
      errorLogger({
        winstonInstance: logger,
      })
    );

    // Use custom error handlers
    this.setErrorHandlers(this.app);
  }

  /**
   * Sets up listeners for various process events.
   */
  setListeners(): void {
    process.on('uncaughtException', (error: Error, origin: string) => {
      logger.error(`Caught exception:\n${util.format(error)}`);
      logger.error(`Origin: ${origin}`);
      this.stop(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
      logger.warn(`Unhandled Rejection at:\n${util.format(promise)}`);
    });
    process.on('SIGINT', () => {
      logger.info(`SIGINT signal received`);
      this.stop(0);
    });
    process.on('SIGTERM', () => {
      logger.info(`SIGTERM signal received`);
      this.stop(0);
    });
    process.on('exit', (code) => {
      logger.info(`Exiting with code ${code}`);
    });
  }

  cleanup(): void {
    throw new Error('Method not implemented.');
  }
}
