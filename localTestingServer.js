const http = require('http');
const { handler } = require('./lambdaHandler');

const hostname = process.env.ARC_LOCAL_HOSTNAME || '127.0.0.1';
const port = process.env.ARC_LOCAL_PORT || 8080;

const server = http.createServer(async (req, res) => {
  console.log(req.url);

  if (req.url && req.url.startsWith('/ifx/local/invoke') && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const bodyJSON = JSON.parse(body);

      try {
        const handlerResponse = await handler(bodyJSON);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(handlerResponse));
      } catch (error) {
        console.error(error);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.toString() }));
      }
    });
  } else {
    console.log('Please use POST with body to /ifx/local/invoke for local testing');
    res.writeHead(500);
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Local Server Started at http://${hostname}:${port}/ifx/local/invoke`);
});
