const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET should be at least 16 chars'),
  ACCESS_TOKEN_EXPIRE: z.string().default('1h'),
  REFRESH_TOKEN_EXPIRE: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  MONGO_MAX_POOL_SIZE: z.coerce.number().int().positive().default(50),
  MONGO_MIN_POOL_SIZE: z.coerce.number().int().nonnegative().default(5),
  LOG_LEVEL: z.string().default('info'),
  MAIL_FROM: z.string().default('no-reply@placement.local'),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.enum(['true', 'false']).default('false'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CLOUDINARY_RESUME_FOLDER: z.string().default('placement/resumes'),
  SKIP_EMAIL_VERIFICATION: z.enum(['true', 'false']).default('true'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

module.exports = parsed.data;

