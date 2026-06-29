const pino = require('pino');
const env = require('../config/env');

const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'placement-management-backend', env: env.NODE_ENV },
});

module.exports = logger;

