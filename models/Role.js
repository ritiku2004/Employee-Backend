const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: String,
  sidebarMenus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SideBarMenu' }],
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  deleted: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
});

module.exports = mongoose.model('Role', RoleSchema);
