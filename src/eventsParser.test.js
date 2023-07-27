const parseEvent = require('./eventsParser');

describe('Parsing Events', () => {
  test('Event dates are parsed correctly', () => {
    const event = {
      eventName: 'test_event',
      eventTime: 1679696377, // March 24th, 2023 in Epoch Seconds
      typeId: 1,
      version: 2,
      body: {

      },
    };

    const processedEvent = parseEvent(event);

    expect(processedEvent.time).toBeTruthy();

    expect(processedEvent.time.getFullYear()).toBe(2023);
    expect(processedEvent.time.getDate()).toBe(24);
    expect(processedEvent.time.getMonth()).toBe(2); // Months are 0 indexed
  });

  test('Legacy events are converted correctly', () => {
    const event = {
      eventType: 'VERIFY_EMAIL',
      eventTime: 1687957226678, // June 28th, 2023 in Epoch Seconds
      body: {
        email: 'test-email@washpost.com',
        nonce: 'abc',
        uuid: '123',
      },
      function: 'arn:aws:test',
      tenantId: 456,
    };

    const processedEvent = parseEvent(event);

    expect(processedEvent.time).toBeTruthy();
    expect(processedEvent.key).toBe('commerce:VERIFY_EMAIL');
    expect(processedEvent.body.email).toBe('test-email@washpost.com');
    expect(processedEvent.version).toBe(1);

    expect(processedEvent.time.getFullYear()).toBe(2023);
    expect(processedEvent.time.getDate()).toBe(28);
    expect(processedEvent.time.getMonth()).toBe(5); // Months are 0 indexed
  });
});
