const DEFAULT_NAMESPACE = 'commerce:';
const DEFAULT_NUMBER_VALUE = 0;
const DEFAULT_STRING_VALUE = '';

const getNumberValue = (property) => {
  if (typeof property === 'number') {
    return property;
  }

  return DEFAULT_NUMBER_VALUE;
};

const getStringValue = (property) => {
  if (typeof property === 'string') {
    return property;
  }

  return DEFAULT_STRING_VALUE;
};

const addNamespace = (key) => {
  if (!key.includes(':')) {
    return DEFAULT_NAMESPACE + key;
  }

  return key;
};

const hasRawEventKey = (rawEvent) => {
  if (
    typeof rawEvent.eventName === 'string'
    || typeof rawEvent.eventType === 'string'
    || (typeof rawEvent.key === 'string' && typeof rawEvent.typeId === 'number')
  ) {
    return true;
  }

  return false;
};

const eventsParser = (rawEvent) => {
  if (typeof rawEvent === 'object'
    && typeof rawEvent.body === 'object'
    && hasRawEventKey(rawEvent)
  ) {
    const eventProcessed = {
      version: null,
      key: null,
      body: rawEvent.body,
      typeId: null,
      time: null,
      uuid: null,
    };

    if (typeof rawEvent.version === 'number' && rawEvent.version > 1) {
      if (
        typeof rawEvent.typeId === 'number'
        && (rawEvent.typeId === 1 || rawEvent.typeId === 5)
      ) {
        if (rawEvent.typeId === 5) {
          eventProcessed.uri = null;
          eventProcessed.currentUserId = getStringValue(rawEvent.currentUserId);
        }

        eventProcessed.version = rawEvent.version;
        eventProcessed.key = addNamespace(rawEvent.eventName);
        eventProcessed.typeId = rawEvent.typeId;

        if (Object.hasOwn(rawEvent, 'eventTime')) {
          // 'eventTime' is in EPOCH format based on seconds
          eventProcessed.time = new Date(getNumberValue(rawEvent.eventTime));
        }

        if (Object.hasOwn(rawEvent, 'uuid')) {
          eventProcessed.uuid = getStringValue(rawEvent.uuid);
        }
      }
    } else if (Object.hasOwn(rawEvent, 'eventType')) {
      eventProcessed.version = 1;
      eventProcessed.key = addNamespace(rawEvent.eventType);
      eventProcessed.typeId = 1;
      // 'eventTime' is in EPOCH format based on seconds
      eventProcessed.time = new Date(getNumberValue(rawEvent.eventTime));
    } else if (Object.hasOwn(rawEvent, 'key')) {
      eventProcessed.version = 1;
      eventProcessed.key = addNamespace(rawEvent.key);
      eventProcessed.typeId = 1;
      eventProcessed.uuid = getStringValue(rawEvent.uuid);
      eventProcessed.uri = getStringValue(rawEvent.uri);
      eventProcessed.currentUserId = getStringValue(rawEvent.currentUserId);
    } else {
      throw new Error('Invalid event payload');
    }

    return eventProcessed;
  }

  return rawEvent;
};

module.exports = eventsParser;
