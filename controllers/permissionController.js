const permissionService = require('../services/permissionService');

exports.getAllPermissions = async (req, res) => {
  try {
    const perms = await permissionService.getAllPermissions();
    res.json(perms);
  } catch (err) {
    console.error('getAllPermissions error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
