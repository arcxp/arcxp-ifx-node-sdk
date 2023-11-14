const eventsHandlersRouter = require('./eventsHandlersRouter');

const eventsHandlers = {
  handler1: () => ({ message: 'Handler 1 was called.' }),
  handler2: () => ({ message: 'Handler 2 was called.' }),
  handler3: () => ({ message: 'Handler 3 was called.' }),
  handler4: () => ({ message: 'Handler 4 was called.' }),
  defaultHandler: () => ({ message: 'Default handler was called.' }),
};

const eventsRouter = {
  handler1: ['commerce:event1', 'commerce:event2'],
  handler2: ['commerce:event3'],
  handler3: ['other:EVENT_A'],
  handler4: ['other:event_b'],
};

describe('eventsHandlersRouter', () => {
  it('should route the event to the correct handler', async () => {
    const event = {
      key: 'commerce:event1', // Event key that matches handler1
    };

    const router = eventsHandlersRouter(eventsHandlers, eventsRouter);

    const result = await router(event);

    expect(result).toEqual({ body: { message: 'Handler 1 was called.' } });
  });

  it('should route the event to the correct handler', async () => {
    const event = {
      key: 'commerce:event1', // Event key that matches handler1
    };

    const router = eventsHandlersRouter(eventsHandlers, eventsRouter);

    const result = await router(event);

    expect(result).toEqual({ body: { message: 'Handler 1 was called.' } });
  });

  it('should use the default handler if no matching handler found', async () => {
    const event = {
      key: 'commerce:unknownEvent', // No matching handler
    };

    const router = eventsHandlersRouter(eventsHandlers, eventsRouter);

    const result = await router(event);

    expect(result).toEqual({ body: { message: 'Default handler was called.' } });
  });
});
