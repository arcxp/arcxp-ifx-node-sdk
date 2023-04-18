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
});
