const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (decoded.role === 'student') {
        user = await Student.findById(decoded.id).select('-password');
      } else if (decoded.role === 'recruiter') {
        user = await Recruiter.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      req.userRole = decoded.role;
      next();
    } catch {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}. Your session role: ${req.userRole || 'unknown'}.`,
      });
    }
    next();
  };
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h',
  });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role, type: 'refresh', jti: crypto.randomUUID() }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });
};

module.exports = { protect, authorize, generateToken, generateRefreshToken };
