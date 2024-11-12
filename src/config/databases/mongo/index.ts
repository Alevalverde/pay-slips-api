import MongoConnection from 'qsocialnow-common/lib/databases/mongo/mongo-connection';
import config from '@/config';

export const appSocialDBConnection = new MongoConnection(config.APP_SOCIAL_DB_URL).getConnection();
export const etlDBConnection = new MongoConnection(config.ETL_DB_URL).getConnection();
