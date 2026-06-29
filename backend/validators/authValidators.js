const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password too long')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number');

const emailSchema = z.string().email().max(254);

const registerStudentSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().min(8).max(20),
  branch: z.string().min(2).max(40),
  cgpa: z.number().min(0).max(10),
});

const registerRecruiterSchema = z.object({
  companyName: z.string().min(2).max(120),
  hrName: z.string().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().min(0).max(20).optional().default(''),
  website: z.string().min(0).max(200).optional().default(''),
  description: z.string().min(0).max(1000).optional().default(''),
});

const loginSchema = z.object({
  role: z.enum(['student', 'recruiter', 'admin']),
  email: z.string().min(2).max(254),
  password: z.string().min(1).max(200),
});

module.exports = {
  registerStudentSchema,
  registerRecruiterSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
};

