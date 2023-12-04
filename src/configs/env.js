import path from 'path';

import { Joi } from 'express-validation';

import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

// Convert the URL of the current module to a file path and assign it to '__filename'.
export const __filename = fileURLToPath(import.meta.url);

// Determine the directory name of the current module and assign it to '__dirname'.
export const __dirname = path.dirname(__filename);

// Define a Joi schema for validating the 'NODE_ENV' environment variable.
const nodeEnvValidator = Joi.string()
  .allow('development', 'production', 'test')
  .default('development');

// Define the overall Joi schema for the 'NODE_ENV' environment variable.
const nodeEnvSchema = Joi.object({
  NODE_ENV: nodeEnvValidator
})
  .unknown()
  .required();

// Validate the current process's environment variables against the 'nodeEnvSchema'.
const { error: envError, value } = nodeEnvSchema.validate(process.env);

// Throw an error if the environment variable validation fails.
if (envError) {
  throw new Error(`Environment validation error: ${envError.message}`);
}

// Resolve the path to the appropriate '.env' file based on the 'NODE_ENV' value.
const envFilePath = path.resolve(__dirname, '..', '..', `.env.${value.NODE_ENV}`);

// Configure dotenv to load environment variables from the file at 'envFilePath'.
const envConfigContent = dotenv.config({ path: envFilePath });

// Throw an error if there is an issue loading the '.env' file (except in 'production' or 'test' environments).
if (envConfigContent.error && value.NODE_ENV === 'development') {
  throw new Error(`Environment file config error: ${envConfigContent.error}`);
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: nodeEnvValidator,
  PORT: Joi.when('NODE_ENV', {
    is: Joi.string().valid('development', 'test'),
    then: Joi.number().default(4000),
    otherwise: Joi.number().required()
  }),
  MONGOOSE_DEBUG: Joi.when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }).description('Enable mongoose debug mode'),
  JWT_SECRET: Joi.when('NODE_ENV', {
    is: Joi.string().equal('test'),
    then: Joi.string().default('test-secret'),
    otherwise: Joi.string().required()
  }).description('JWT Secret required to sign'),
  JWT_TOKEN_EXPIRIES: Joi.when('NODE_ENV', {
    is: Joi.string().valid('development', 'test'),
    then: Joi.number().default(1440),
    otherwise: Joi.number().required()
  }).description('JWT expiration time in seconds'),
  MONGODB_URI: Joi.when('NODE_ENV', {
    is: Joi.string().valid('test'),
    then: Joi.string().default('mongodb://localhost:27017/sakura-pantry'),
    otherwise: Joi.string().required()
  }).description('Mongo DB host url'),
  CLIENT_HOST: Joi.when('NODE_ENV', {
    is: Joi.string().valid('test', 'development'),
    then: Joi.string().default('http://localhost:3000'),
    otherwise: Joi.string().required()
  }).description('Client host url'),
  EMAIL_USER: Joi.when('NODE_ENV', {
    is: Joi.string().equal('test'),
    then: Joi.string().default('test@test.com'),
    otherwise: Joi.string().required()
  }).description('Mail service user'),
  EMAIL_PASSWORD: Joi.when('NODE_ENV', {
    is: Joi.string().equal('test'),
    then: Joi.string().default('test-password'),
    otherwise: Joi.string().required()
  }).description('Mail service password')
})
  .unknown()
  .required();

// Validate the current process's environment variables against the 'envVarsSchema'.
const { error, value: envVars } = envVarsSchema.validate(process.env);

// Throw an error if the environment variable validation fails.
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export the validated and processed environment variables in an object.
export const envConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  clientHost: envVars.CLIENT_HOST,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_TOKEN_EXPIRIES,
  frontendUrl: envVars.CLIENT_HOST,
  mail: {
    user: envVars.EMAIL_USER,
    password: envVars.EMAIL_PASSWORD
  },
  mongo: {
    host: envVars.MONGODB_URI
  }
};
