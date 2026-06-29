const env = require('./env');

const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (env.NODE_ENV === 'development' && LOCAL_DEV_ORIGIN.test(origin)) return true;
  return false;
};

module.exports = { allowedOrigins, isOriginAllowed };
