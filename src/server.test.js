const supertest = require('supertest');
const { createServer } = require('./server');
const localRouter = require('./eventsHandlersRouter');

describe('When the server receives a request', () => {
  let app;
  let stubbedHandlerA;
  let stubbedHandlerB;
  let stubbedDefaultHandler;

  beforeEach(() => {
    stubbedHandlerA = jest.fn();
    stubbedHandlerB = jest.fn();
    stubbedDefaultHandler = jest.fn();

    const routerMap = {
      handlerA: ['myapp:myeventA'],
      handlerB: ['myapp:myeventb'],
    };

    const stubbedHandlers = {
      handlerA: stubbedHandlerA,
      handlerB: stubbedHandlerB,
      defaultHandler: stubbedDefaultHandler,
    };

    const stubbedRouter = localRouter(stubbedHandlers, routerMap, false);

    app = createServer(stubbedRouter);
  });

  it('Returns a 200 response when an event name and body are provided', async () => {
    const body = {
      key: 'something',
      body: {
        url: 'google.com',
      },
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);
  });

  it('Calls the correct handler based on the event name provided', async () => {
    const body = {
      key: 'myapp:myeventA',
      body: {
        url: 'google.com',
      },
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);

    expect(stubbedHandlerA).toHaveBeenCalled();
    expect(stubbedHandlerB).not.toHaveBeenCalled();
    const payloadGivenToHandler = stubbedHandlerA.mock.calls[0][0];

    expect(payloadGivenToHandler.key).toBe('myapp:myeventA');
    expect(payloadGivenToHandler.body.url).toBe('google.com');
  });

  it('Calls the default handler when an event does not have a matching handler', async () => {
    const body = {
      key: 'myapp:myeventC',
      body: {
        url: 'google.com',
      },
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);

    expect(stubbedHandlerA).not.toHaveBeenCalled();
    expect(stubbedHandlerB).not.toHaveBeenCalled();
    expect(stubbedDefaultHandler).toHaveBeenCalled();
    const payloadGivenToHandler = stubbedDefaultHandler.mock.calls[0][0];

    expect(payloadGivenToHandler.key).toBe('myapp:myeventC');
    expect(payloadGivenToHandler.body.url).toBe('google.com');
  });

  it('Passes the correct payload to the handler, including conversion of the time if provided', async () => {
    const epochSecondsStr = '1679696377';
    const body = {
      key: 'myapp:myeventA',
      time: epochSecondsStr, // March 24th, 2023 in Epoch Seconds
      body: {
        url: 'google.com',
      },
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);

    expect(stubbedHandlerA).toHaveBeenCalled();
    expect(stubbedHandlerB).not.toHaveBeenCalled();
    expect(stubbedDefaultHandler).not.toHaveBeenCalled();
    const payloadGivenToHandler = stubbedHandlerA.mock.calls[0][0];

    expect(payloadGivenToHandler.key).toBe('myapp:myeventA');

    expect(payloadGivenToHandler).toStrictEqual({
      key: 'myapp:myeventA',
      version: 2,
      typeId: 1,
      uuid: '',
      currentUserId: '',
      time: new Date(Number(epochSecondsStr) * 1000),
      body: {
        url: 'google.com',
      },
    });
  });

  it('Passes a valid payload to the handler using default values where necessary', async () => {
    const body = {
      key: 'myapp:myeventA',
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);

    expect(stubbedHandlerA).toHaveBeenCalled();
    expect(stubbedHandlerB).not.toHaveBeenCalled();
    expect(stubbedDefaultHandler).not.toHaveBeenCalled();
    const payloadGivenToHandler = stubbedHandlerA.mock.calls[0][0];

    expect(payloadGivenToHandler.key).toBe('myapp:myeventA');
    expect(payloadGivenToHandler.version).toBe(2);
    expect(payloadGivenToHandler.typeId).toBe(1);
    expect(payloadGivenToHandler.uuid).toBe('');
    expect(payloadGivenToHandler.currentUserId).toBe('');
    expect(payloadGivenToHandler.time).toBeTruthy();
    expect(payloadGivenToHandler.body).toStrictEqual({});
  });

  it('Passes an empty body to the handler when no \'body\' key is provided in the payload', async () => {
    const body = {
      key: 'myapp:myeventA',
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);

    expect(stubbedHandlerA).toHaveBeenCalled();
    expect(stubbedHandlerB).not.toHaveBeenCalled();
    const payloadGivenToHandler = stubbedHandlerA.mock.calls[0][0];

    expect(payloadGivenToHandler.key).toBe('myapp:myeventA');
    expect(payloadGivenToHandler.body).toStrictEqual({});
  });

  it('Returns a 400 when an empty payload is provided', async () => {
    await supertest(app)
      .post('/ifx/local/invoke')
      .expect(400);
  });

  it('Returns a 404 response when an unknown route is requested', async () => {
    await supertest(app)
      .post('/ifx/fake')
      .expect(404);
  });
});
