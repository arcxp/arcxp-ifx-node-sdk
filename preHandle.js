const PROTECTED_ENVIRONMENT_VARIABLE_KEYS = [
  'AWS_SESSION_TOKEN',
  'AWS_LAMBDA_RUNTIME_API',
  'AWS_XRAY_DAEMON_ADDRESS',
  'AWS_SECRET_ACCESS_KEY',
  'NODE_PATH',
  'AWS_ACCESS_KEY_ID',
  '_AWS_XRAY_DAEMON_ADDRESS',
  '_X_AMZN_TRACE_ID',
];

const sanitizeEnvironment = () => {
  PROTECTED_ENVIRONMENT_VARIABLE_KEYS.forEach((key) => {
    delete process.env[key];
  });
};

module.exports = {
  sanitizeEnvironment,
};
