require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const responseTime = require('response-time');
const pinoHttp = require('pino-http');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const env = require('./config/env');
const { isOriginAllowed } = require('./config/cors');
const logger = require('./utils/logger');
const { register, httpRequestDuration, httpRequestsTotal } = require('./utils/metrics');
const { maintenanceGate } = require('./utils/maintenance');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
app.set('trust proxy', 1);

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});

app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({ requestId: req.id }),
  })
);

app.use(
  cors({
    origin(origin, cb) {
      if (isOriginAllowed(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(
  responseTime((req, res, time) => {
    const route = req.route?.path || req.baseUrl || req.path || 'unknown';
    const labels = { method: req.method, route: String(route), status_code: String(res.statusCode) };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, time);
  })
);

app.use((req, res, next) => {
  req.setTimeout(env.REQUEST_TIMEOUT_MS);
  res.setTimeout(env.REQUEST_TIMEOUT_MS);
  next();
});

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

app.use(maintenanceGate);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'placement-management-backend',
    uptimeSec: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ready', (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  if (!mongoReady) return res.status(503).json({ status: 'not_ready', mongo: mongoose.connection.readyState });
  return res.json({ status: 'ready' });
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/interviews', interviewRoutes);

app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS blocked origin:')) {
    req.log?.warn({ err, requestId: req.id }, 'CORS rejected request');
    return res.status(403).json({
      message: 'This site origin is not allowed. Use http://localhost:3000 or add your URL to CORS_ORIGINS.',
      requestId: req.id,
    });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Server Error' : err.message;
  req.log?.error({ err, status, requestId: req.id }, 'Request failed');
  res.status(status).json({ message, requestId: req.id });
});

const start = async () => {
  await connectDB();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
  });

  const shutdown = async (signal) => {
    logger.warn({ signal }, 'Graceful shutdown initiated');
    server.close(async () => {
      try {
        await mongoose.connection.close(false);
      } catch (e) {
        logger.error({ err: e }, 'Error closing MongoDB connection');
      }
      logger.info('Server shutdown complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 15000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));
};

start().catch((err) => {
  logger.error({ err }, 'Fatal startup error');
  process.exit(1);
});
