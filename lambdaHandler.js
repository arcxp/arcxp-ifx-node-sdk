require('dotenv').config();

const eventsHandlersRouter = require('./eventsHandlersRouter');
const eventsHandlers = require('../../../src/eventsHandlers');
const eventsRouter = require('../../../src/eventsRouter.json');

module.exports.handler = eventsHandlersRouter(eventsHandlers, eventsRouter);
