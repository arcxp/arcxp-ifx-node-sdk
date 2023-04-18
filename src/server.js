// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

/**
 *
 * @param {Function} handlerMethod This optional parameter accepts an event body and returns a
 * response. It will send the event body to the proper handler based on event.key.
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
    handler = require('../lambdaHandler').handler;
  }

  app.use(bodyParser.json());

  app.use((_, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.post('/ifx/local/invoke', async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) throw new Error('Request body is required');
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
