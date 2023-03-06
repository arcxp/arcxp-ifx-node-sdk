const eventsParser = require('./eventsParser');

const noHandlerFound = (event) => {
  const message = 'No handler was found for the event.';

  console.log('Event received:', JSON.stringify(event, null, 2));
  console.log(message);

  return { message };
};

const eventsHandlersRouter = (eventsHandlers, eventsRouter) => async (event) => {
  console.log('Raw event:', event);

  const eventProcessed = eventsParser(event);

  console.log('Processed event:', eventProcessed);

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
