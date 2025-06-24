const Role = require('../models/Role');

exports.createRole = async ({ name, sidebarMenus, permissions }) => {
  const role = new Role({ name, sidebarMenus, permissions });
  await role.save();
};

exports.getAllRoles = async () => {
  return Role.find()
    .populate('sidebarMenus')
    .populate('permissions')
    .lean();
};
