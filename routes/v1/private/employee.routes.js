const express       = require('express');
const router        = express.Router();
const { verifyToken } = require('../../../middlewares/auth');
const authorization = require('../../../middlewares/authorization');
const empCtrl       = require('../../../controllers/employee.controller');

router.post(
  '/',
  verifyToken,
  authorization,
  empCtrl.createEmployee
);

router.get(
  '/',
  verifyToken,
  authorization,
  empCtrl.getEmployeeList
);

router.put(
  '/:id',
  verifyToken,
  authorization,
  empCtrl.editEmployee
);

router.delete(
  '/:id',
  verifyToken,
  authorization,
  empCtrl.deleteEmployee
);

module.exports = router;
