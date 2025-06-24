require('dotenv').config();
const jwt = require('jsonwebtoken');

// Verify JWT signature & attach user info to request
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, "Secret");
    req.user = payload; // payload must include `sub` field
    next();
  } catch (err) {
    console.error('JWT verify failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based shortcut if needed
exports.requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user?.roleName || !allowedRoles.includes(req.user.roleName)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  }
  next();
};
