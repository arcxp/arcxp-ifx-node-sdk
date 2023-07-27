// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const DEFAULT_PAYLOAD = {
  body: {},
  version: 2,
  typeId: 1,
  time: new Date(),
  uuid: '',
  currentUserId: '',
};

/**
 *
 * @param {Function} handlerMethod This optional parameter accepts an event body and returns a
 * response. It will send the event body to the proper handler based on the 'key' property.
 *
 * @returns an ExpressJS server that is listening for an event body in a POST request.
 */
const createServer = (handlerMethod) => {
  const app = express();

  let handler;
  if (handlerMethod) {
    handler = handlerMethod;
  } else {
    // eslint-disable-next-line global-require
    handler = require('../lambdaHandler').localHandler;
  }

  app.use(bodyParser.json());

  app.use((_, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.post('/ifx/local/invoke', async (req, res) => {
    try {
      const body = {
        ...DEFAULT_PAYLOAD,
        ...req.body,
      };

      if (req.body.time) {
        body.time = new Date(Number(req.body.time) * 1000);
      }

      if (!body.key) {
        return res.status(400).json({ error: 'Key must be provided' });
      }
      const handlerResponse = await handler(body);
      return res.status(200).json(handlerResponse);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.toString() });
    }
  });

  app.all('*', (req, res) => {
    console.log('Server could not match url path: ', req.url);
    res.status(404).send({ message: 'Please use POST with body to /ifx/local/invoke for local testing' });
  });

  return app;
};

module.exports.createServer = createServer;
