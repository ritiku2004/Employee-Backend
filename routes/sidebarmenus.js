const express = require('express');
const router = express.Router();
const sidebarMenuController = require('../controllers/sidebarMenuController');

// GET /api/sidebarmenus
router.get('/', sidebarMenuController.getSidebarMenus);

module.exports = router;
