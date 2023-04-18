require('dotenv').config();

const { sanitizeEnvironment } = require('./src/preHandle');

sanitizeEnvironment();

const eventsHandlersRouter = require('./src/eventsHandlersRouter');

// Importing client code
const eventsHandlers = require(process.cwd() + '/src/eventsHandlers');
const eventsRouter = require(process.cwd() + '/src/eventsRouter.json');

module.exports.handler = eventsHandlersRouter(eventsHandlers, eventsRouter);
