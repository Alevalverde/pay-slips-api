import dotenv from 'dotenv';

// Set the NODE_ENV environment variable to 'development' if not already defined
process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';

// Only load env variables from the .env file in production mode
if (process.env.NODE_ENV !== 'production') {
  // Override env variables that have already been set with the values from the .env file
  const envFound = dotenv.config({ override: true });
  if (envFound.error) {
    throw new Error("Couldn't find .env file");
  }
}

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT ?? 8080),
  BASE_URL: '/api/v1',
  DOCS_ENDPOINT: '/api-docs',
  DIR_SWAGGER: './src/config/docs/swagger.yml',
  DIR_ERRORS: './src/config/errors/error.yml',
  JWT_SECRET: String(process.env.JWT_SECRET),
  BASE_DOMAIN: process.env.BASE_DOMAIN ?? '',
  MONGO_URL: process.env.MONGO_URL ?? '',
  MAX_FILE_SIZE_BYTES: process.env.MAX_FILE_SIZE_BYTES ?? '10485760',
  GOOGLE_CREDENTIAL: process.env.GOOGLE_CREDENTIAL ?? '',
  FOLDER_ID_PAYSLIP: process.env.FOLDER_ID_PAYSLIP ?? '',
  FOLDER_ID_SCHOOLFEE: process.env.FOLDER_ID_SCHOOLFEE ?? '',
};
