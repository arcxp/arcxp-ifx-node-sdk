const { sanitizeEnvironment } = require('./preHandle');

test('Environment variables are scrubbed', () => {
  process.env.AWS_SESSION_TOKEN = 'test-value';

  expect(process.env.AWS_SESSION_TOKEN).toBe('test-value');

  sanitizeEnvironment();

  expect(process.env.AWS_SESSION_TOKEN).toBe(undefined);
});
