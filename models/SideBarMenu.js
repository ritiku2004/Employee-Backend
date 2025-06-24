const mongoose = require('mongoose');

const SubmenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  to: { type: String, required: true }
}, { _id: false });

const SideBarMenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['menu-title', 'collapsible', 'route'], required: true },

  // for menu-title
  module_id: { type: String },
  module_priority: { type: Number },

  // for collapsible & route
  parent_module_id: { type: String },
  module_menu_priority: { type: Number },

  iconStyle: { type: String, default: '' },
  classsChange: { type: String, default: '' },
  extraclass: { type: String, default: '' },

  // only for 'route'
  to: { type: String },

  // only for 'collapsible'
  content: { type: [SubmenuSchema], default: [] }
});

module.exports = mongoose.model('SideBarMenu', SideBarMenuSchema);
