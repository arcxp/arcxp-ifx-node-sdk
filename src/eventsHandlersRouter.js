const eventsParser = require('./eventsParser');

const noHandlerFound = () => ({ message: 'No handler was found for the event.' });

/**
 * Creates a unified event handler and router function for processing events.
 *
 * @param {Object} eventsHandlers - An object containing event handlers for different event types.
 * @param {Object} eventsRouter - An object specifying the mapping between event keys and handler
 * types.
 * @param {*} transformEvents Whether the request payload and response body should be transformed
 * before being sent to their respective destinations.
 * @returns
 */
// eslint-disable-next-line max-len
const eventsHandlersRouter = (eventsHandlers, eventsRouter, transformEvents = true) => async (event) => {
  let eventProcessed;

  if (transformEvents) {
    eventProcessed = eventsParser(event);
  } else {
    eventProcessed = event;
  }

  let handler = noHandlerFound;

  const handlerFound = typeof eventProcessed.key === 'string'
    ? Object.keys(eventsRouter).find(
      (eventHandler) => eventsRouter[eventHandler].includes(eventProcessed.key)
        && Object.hasOwn(eventsHandlers, eventHandler),
    )
    : undefined;

  if (handlerFound) {
    handler = eventsHandlers[handlerFound];
  } else if (Object.hasOwn(eventsHandlers, 'defaultHandler')) {
    handler = eventsHandlers.defaultHandler;
  }
  const response = await handler(eventProcessed);

  return transformEvents ? { body: response } : response;
};

module.exports = eventsHandlersRouter;
