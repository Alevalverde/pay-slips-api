import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

class MongoConnection {
  private readonly connection: mongoose.Connection;

  constructor(uri: string, options?: mongoose.ConnectOptions) {
    this.connection = mongoose.createConnection(uri, options);
    this.addListeners();
  }

  getConnection(): mongoose.Connection {
    return this.connection;
  }

  addListeners() {
    this.connection.on('error', (error) => {
      logger.error(`⚠️  Database connection error: ${error}`);
      throw error;
    });

    this.connection.on('disconnected', () => {
      logger.info('⚠️  Database disconnected');
    });

    this.connection.on('connected', () => {
      logger.info(`⚡ Database connected successfully`);
    });
  }
}

export default MongoConnection;
