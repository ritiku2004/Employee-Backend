const roleService = require('../services/roleService');

exports.createRole = async (req, res) => {
  try {
    await roleService.createRole(req.body);
    res.status(201).json({ message: 'Role created successfully' });
  } catch (err) {
    console.error('createRole error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error('getAllRoles error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
