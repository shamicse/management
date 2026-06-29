const express = require('express');
const {
  registerStudent,
  registerRecruiter,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
  registerStudentSchema,
  registerRecruiterSchema,
  loginSchema,
  emailSchema,
  passwordSchema,
} = require('../validators/authValidators');
const { z } = require('zod');

const router = express.Router();

router.post('/student/register', validate({ body: registerStudentSchema }), registerStudent);
router.post('/recruiter/register', validate({ body: registerRecruiterSchema }), registerRecruiter);
router.post('/login', validate({ body: loginSchema }), login);
router.post(
  '/verify-email',
  validate({ body: z.object({ role: z.enum(['student', 'recruiter']), email: emailSchema, token: z.string().min(10) }) }),
  verifyEmail
);
router.post(
  '/resend-verification',
  validate({ body: z.object({ role: z.enum(['student', 'recruiter']), email: emailSchema }) }),
  resendVerification
);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post(
  '/forgot-password',
  validate({ body: z.object({ role: z.enum(['student', 'recruiter']), email: emailSchema }) }),
  forgotPassword
);
router.post(
  '/reset-password',
  validate({
    body: z.object({
      role: z.enum(['student', 'recruiter']),
      email: emailSchema,
      token: z.string().min(10),
      newPassword: passwordSchema,
    }),
  }),
  resetPassword
);

module.exports = router;
