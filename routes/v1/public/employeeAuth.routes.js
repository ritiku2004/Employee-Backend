const express = require('express');
const router  = express.Router();
const authCtrl = require('../../../controllers/employeeAuth.controller');

router.post('/login',     authCtrl.login);
router.get ('/auto-login', authCtrl.autoLogin);
router.post('/logout',    authCtrl.logout);

module.exports = router;
