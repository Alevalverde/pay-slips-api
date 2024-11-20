import MongoConnection from './mongo/mongo-connection';
import config from '@/config';

const connection = new MongoConnection(config.MONGO_URL).getConnection();

export default connection;
