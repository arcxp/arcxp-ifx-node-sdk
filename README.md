# Usage
All events run through the Node SDK before being passed to handler code.

## Event Routing
The SDK expects the consuming repo to have a router json file at `src/eventsRouter.json` where the keys of the json file are 
names of handler files and the values are an array representing the event keys that you would like 
sent to that handler.

Example: 
```json
{
  "myHandlerOne": ["story:create", "story:update"],
  "myHandlerTwo": ["story:delete"]
}
```

Note: Only one handler can accept an event from an invocation. If an event key is placed in the key 
list of multiple handlers, only the first will be invoked with an event with that key value.

## Event Handlers
The SDK expects the consuming repo to have javascript handlers placed in the `src/eventHandlers` 
directory.

Events will be handlers in the following format:

```
{
  "key": "string", // The event key. Ex: 'story:create'
  "typeId": 5, // 1 or 5. 1 indicates an asynchronous event
  "version": 2,
  "time": Object, // A native javascript date object representing the time that an event took place
  "uuid": "", // An optional field used on a subset of events. 
  "currentUserId": "", // The user ID of the user associated with an event. This will only appear on certain synchronous events. 
  "body": {} // A JSON object sent by the emitting application. This will differ per event type.
}
```

A handler is a javascript file that exports a method that accepts an event as input and optionally
returns a response body in the case of synchronous events.

Example synchronous handler:

```js
const myHandlerOne = (event) => {
  console.log(`myHandlerOne Invoked with event with key ${event.key}`);

  return { "status": "Event processed correctly" }
}

module.exports = myHandlerOne;
```

Example asynchronous handler
```js
const myHandlerTwo = async (event) => {
  console.log(`myHandlerTwo Invoked with event with key ${event.key}`);
  await someAsyncFn();
  console.log("Finished async action");
}

module.exports = myHandlerTwo;
```

## Local Testing
The Node SDK can be utilized to locally test events invoking your handlers. The command
`npm run localTestingServer` will spin up an [Express](https://expressjs.com/) server at
http://localhost:8080 that can be used to test your event handlers. By making a POST request to
http://localhost:8080/ifx/local/invoke, the payload body will be directly sent to your handler
based on the `key` property.

The only required field is `key` when locally testing. If any fields are omitted on a payload using
the local development server, default values will be provided to the handlers.

Example payload to use in a POST request:
```json
{
    "key": "story:create",
    "body": {
        "subheadlines": { 
            "basic": "My Subheadline here"
        }
    }
}
```

# Configuration
## Environment
The Node SDK allows clients to specify environment specific configuration via
[dotenv](https://www.npmjs.com/package/dotenv) files in the root directory of the running
application. **Do not store secrets or api keys in these .env files.**

See expected folder structure below.
```sh
.
├── .env.development
├── .env.production
├── .env.sandbox
├── .gitignore
├── README.md
├── package.json
├── src
│   ├── eventsHandlers
│   │   ├── defaultHandler.js
```
