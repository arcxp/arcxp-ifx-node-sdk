const port = process.env.ARC_LOCAL_PORT || 8080;
const hostname = process.env.ARC_LOCAL_HOSTNAME || '127.0.0.1';

const { createServer } = require('./src/server');

const app = createServer();

app.listen(port, hostname, () => {
  console.log(`Local Express Server Started at http://${hostname}:${port}/ifx/local/invoke`);
});

module.exports = app;
