const sidebarMenuService = require('../services/sidebarMenuService');

exports.getSidebarMenus = async (req, res) => {
  try {
    const flattened = await sidebarMenuService.getSidebarMenus();
    res.json(flattened);
  } catch (err) {
    console.error('getSidebarMenus error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
