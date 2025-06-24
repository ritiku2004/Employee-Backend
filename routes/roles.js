const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// POST /api/roles
router.post('/', roleController.createRole);

// GET /api/roles
router.get('/', roleController.getAllRoles);

module.exports = router;
