const getEnv = () => {
  if (process.env.ENV === 'sandbox' || process.env.ENV === 'test') {
    return 'sandbox';
  } if (process.env.ENV === 'production' || process.env.ENV === 'prod') {
    return 'production';
  }
  return 'development';
};

const env = getEnv();

// lambdaHandler.js is the entrypoint of all Lambda invocations.
// Because of this, environment file intiialization should be the first thing that is loaded.

// Load the environment file '.env' containing secrets that the build process generates
require('dotenv').config({});

// Load client environment files
console.log('Loading environment configuration for env: ', env);
require('dotenv').config({
  path: process.cwd() + '/.env.' + env,
});

const { sanitizeEnvironment } = require('./src/preHandle');

sanitizeEnvironment();

const eventsHandlersRouter = require('./src/eventsHandlersRouter');

// Importing client code
const eventsHandlers = require(process.cwd() + '/src/eventsHandlers');
const eventsRouter = require(process.cwd() + '/src/eventsRouter.json');

module.exports.handler = eventsHandlersRouter(eventsHandlers, eventsRouter);
