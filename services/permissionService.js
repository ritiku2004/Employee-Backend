const Permission = require('../models/Permission');

exports.getAllPermissions = async () => {
  return Permission.find().lean();
};
