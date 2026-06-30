const jwt = require('jsonwebtoken');
const SiteSetting = require('../models/SiteSetting');

const MAINTENANCE_KEY = 'maintenance';
const MAINTENANCE_DURATION_MS = 4 * 60 * 60 * 1000;

const normalizeMaintenance = async (setting) => {
  const value = setting?.value || {};
  if (!value.enabled) return { enabled: false };

  const expiresAt = value.expiresAt ? new Date(value.expiresAt) : null;
  if (!expiresAt || expiresAt <= new Date()) {
    await SiteSetting.findOneAndUpdate(
      { key: MAINTENANCE_KEY },
      { value: { enabled: false, disabledAt: new Date() } },
      { upsert: true }
    );
    return { enabled: false };
  }

  return {
    enabled: true,
    startedAt: value.startedAt,
    expiresAt: expiresAt.toISOString(),
    message: value.message || 'Updating the site. Please wait.',
  };
};

const getMaintenanceStatus = async () => {
  const setting = await SiteSetting.findOne({ key: MAINTENANCE_KEY });
  return normalizeMaintenance(setting);
};

const setMaintenanceMode = async ({ enabled, adminId }) => {
  const now = new Date();
  const value = enabled
    ? {
        enabled: true,
        startedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + MAINTENANCE_DURATION_MS).toISOString(),
        enabledBy: adminId,
        message: 'Updating the site. Please wait.',
      }
    : {
        enabled: false,
        disabledAt: now.toISOString(),
        disabledBy: adminId,
      };

  const setting = await SiteSetting.findOneAndUpdate(
    { key: MAINTENANCE_KEY },
    { value },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return normalizeMaintenance(setting);
};

const isAdminBearer = (req) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) return false;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

const maintenanceGate = async (req, res, next) => {
  const allowedPaths = ['/api/health', '/api/ready', '/api/admin/maintenance/status'];
  if (allowedPaths.includes(req.path)) return next();

  const isLogin = req.path === '/api/auth/login';
  if (!isLogin && isAdminBearer(req)) return next();

  try {
    const status = await getMaintenanceStatus();
    if (!status.enabled) return next();

    if (isLogin && req.body?.role === 'admin') return next();

    return res.status(503).json({
      message: status.message,
      maintenance: status,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  MAINTENANCE_DURATION_MS,
  getMaintenanceStatus,
  setMaintenanceMode,
  maintenanceGate,
};
