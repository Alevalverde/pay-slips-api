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
  BASE_DOMAIN: process.env.BASE_DOMAIN,
  APP_SOCIAL_DB_URL: process.env.APP_SOCIAL_DB_URL || '',
  ETL_DB_URL: process.env.ETL_DB_URL || '',
  SECURITY_API_HOSTNAME: process.env.SECURITY_API_HOSTNAME || 'http://localhost:8080/api/v1',
  USER_VALIDATION_PATHNAME: process.env.USER_VALIDATION_PATHNAME || '/current-user',
  PRODUCT_CODE: process.env.PRODUCT_CODE || 'appsocial',
  PRODUCT_API_HOSTNAME: process.env.PRODUCT_API_HOSTNAME || '',
};
