require('dotenv').config();

const { sanitizeEnvironment } = require('./preHandle');

sanitizeEnvironment();

const eventsHandlersRouter = require('./eventsHandlersRouter');
const eventsHandlers = require('../../../src/eventsHandlers');
const eventsRouter = require('../../../src/eventsRouter.json');

module.exports.handler = eventsHandlersRouter(eventsHandlers, eventsRouter);
