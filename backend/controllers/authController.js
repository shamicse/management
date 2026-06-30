const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const env = require('../config/env');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { createRandomToken, hashToken } = require('../utils/tokens');
const { sendEmail } = require('../utils/email');
const { getMaintenanceStatus } = require('../utils/maintenance');

const skipEmailVerification = env.SKIP_EMAIL_VERIFICATION === 'true';

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
};

const setRefreshCookie = (res, token) => {
  const opts = cookieOptions();
  const maxAgeDays = 7;
  res.cookie('refreshToken', token, { ...opts, maxAge: maxAgeDays * 24 * 60 * 60 * 1000 });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', cookieOptions());
};

const getClientIp = (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';

const issueRefreshToken = async ({ res, userId, role, req }) => {
  const refresh = generateRefreshToken(userId, role);
  const tokenHash = hashToken(refresh);

  const decoded = jwt.verify(refresh, process.env.JWT_SECRET);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    userId,
    role,
    tokenHash,
    expiresAt,
    createdByIp: getClientIp(req),
  });

  setRefreshCookie(res, refresh);
};

const sendVerifyEmail = async ({ user, role }) => {
  const raw = createRandomToken();
  user.emailVerificationTokenHash = hashToken(raw);
  user.emailVerificationExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
  await user.save();

  const base = process.env.APP_BASE_URL || 'http://localhost:3000';
  const link = `${base}/login?verifyToken=${raw}&role=${role}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    text: `Verify your email using this link: ${link}`,
    html: `<p>Verify your email:</p><p><a href="${link}">${link}</a></p>`,
  });
};

const sendResetEmail = async ({ user, role }) => {
  const raw = createRandomToken();
  user.passwordResetTokenHash = hashToken(raw);
  user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min
  await user.save();

  const base = process.env.APP_BASE_URL || 'http://localhost:3000';
  const link = `${base}/login?resetToken=${raw}&role=${role}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Reset your password using this link: ${link}`,
    html: `<p>Reset your password:</p><p><a href="${link}">${link}</a></p>`,
  });
};

const registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, branch, cgpa } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const student = await Student.create({
      name,
      email,
      password,
      phone,
      branch,
      cgpa,
      emailVerified: skipEmailVerification,
    });

    if (!skipEmailVerification) {
      await sendVerifyEmail({ user: student, role: 'student' });
    }
    await issueRefreshToken({ res, userId: student._id, role: 'student', req });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      role: 'student',
      token: generateToken(student._id, 'student'),
      emailVerified: student.emailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerRecruiter = async (req, res) => {
  try {
    const { companyName, hrName, email, password, phone, website, description } = req.body;

    const exists = await Recruiter.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const recruiter = await Recruiter.create({
      companyName,
      hrName,
      email,
      password,
      phone,
      website,
      description,
      emailVerified: skipEmailVerification,
    });

    if (!skipEmailVerification) {
      await sendVerifyEmail({ user: recruiter, role: 'recruiter' });
    }

    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval.',
      _id: recruiter._id,
      companyName: recruiter.companyName,
      role: 'recruiter',
      emailVerified: recruiter.emailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'recruiter') {
      user = await Recruiter.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ username: email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const maintenance = await getMaintenanceStatus();
    if (maintenance.enabled && role !== 'admin') {
      return res.status(503).json({ message: maintenance.message, maintenance });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!skipEmailVerification && role !== 'admin' && !user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    if (role === 'student' && !user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    if (role === 'recruiter') {
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Company not yet approved by admin' });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account deactivated' });
      }
    }

    // Clear any stale refresh cookie from a previous user/role before issuing a new session
    clearRefreshCookie(res);
    if (role !== 'admin') {
      await issueRefreshToken({ res, userId: user._id, role, req });
    }

    const response = {
      _id: user._id,
      role,
      token: generateToken(user._id, role),
    };

    if (role === 'student') {
      response.name = user.name;
      response.email = user.email;
      response.branch = user.branch;
    } else if (role === 'recruiter') {
      response.companyName = user.companyName;
      response.hrName = user.hrName;
      response.email = user.email;
    } else {
      response.username = user.username;
      response.name = user.name;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') return res.status(401).json({ message: 'Invalid refresh token' });

    const tokenHash = hashToken(refreshToken);
    let tokenDoc = await RefreshToken.findOne({ tokenHash, revokedAt: null });

    // Another tab may have rotated the token moments ago — allow a short grace window
    if (!tokenDoc) {
      const rotated = await RefreshToken.findOne({
        tokenHash,
        revokedAt: { $gte: new Date(Date.now() - 60_000) },
        replacedByTokenHash: { $ne: '' },
      });
      if (rotated) {
        return res.json({
          token: generateToken(decoded.id, decoded.role),
          role: decoded.role,
        });
      }
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // rotate token
    tokenDoc.revokedAt = new Date();
    tokenDoc.revokedByIp = getClientIp(req);

    const newRefresh = generateRefreshToken(decoded.id, decoded.role);
    const newHash = hashToken(newRefresh);
    tokenDoc.replacedByTokenHash = newHash;
    await tokenDoc.save();

    const newDecoded = jwt.verify(newRefresh, process.env.JWT_SECRET);
    await RefreshToken.create({
      userId: decoded.id,
      role: decoded.role,
      tokenHash: newHash,
      expiresAt: new Date(newDecoded.exp * 1000),
      createdByIp: getClientIp(req),
    });

    setRefreshCookie(res, newRefresh);
    res.json({ token: generateToken(decoded.id, decoded.role), role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: 'Refresh failed' });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await RefreshToken.findOneAndUpdate(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date(), revokedByIp: getClientIp(req) }
      );
    }

    clearRefreshCookie(res);
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { role, email, token } = req.body;
    if (!token || !role || !email) return res.status(400).json({ message: 'Missing fields' });

    const tokenHash = hashToken(token);
    const now = new Date();

    const Model = role === 'student' ? Student : role === 'recruiter' ? Recruiter : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({
      email,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: { $gt: now },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.emailVerified = true;
    user.emailVerificationTokenHash = '';
    user.emailVerificationExpiresAt = null;
    await user.save();

    res.json({ message: 'Email verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { role, email } = req.body;
    const Model = role === 'student' ? Student : role === 'recruiter' ? Recruiter : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a link was sent' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified' });

    await sendVerifyEmail({ user, role });
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { role, email } = req.body;
    const Model = role === 'student' ? Student : role === 'recruiter' ? Recruiter : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ email });
    if (user) {
      await sendResetEmail({ user, role });
    }
    res.json({ message: 'If the email exists, a reset link was sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { role, email, token, newPassword } = req.body;
    const Model = role === 'student' ? Student : role === 'recruiter' ? Recruiter : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const tokenHash = hashToken(token);
    const now = new Date();

    const user = await Model.findOne({
      email,
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: now },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.passwordResetTokenHash = '';
    user.passwordResetExpiresAt = null;
    await user.save();

    // revoke all refresh tokens for that user/role
    await RefreshToken.updateMany({ userId: user._id, role }, { revokedAt: new Date(), revokedByIp: getClientIp(req) });
    clearRefreshCookie(res);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerStudent,
  registerRecruiter,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
