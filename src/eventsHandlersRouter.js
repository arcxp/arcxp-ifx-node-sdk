const eventsParser = require('./eventsParser');

const noHandlerFound = () => ({ message: 'No handler was found for the event.' });

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

  return handler(eventProcessed);
};

module.exports = eventsHandlersRouter;
