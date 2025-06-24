const Employee = require('../models/Employee');
const Role     = require('../models/Role');

const authorization = async (req, res, next) => {
  try {
    //Find user by `sub` from JWT payload
    const user = await Employee.findById(req.user.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    console.log("User found");

    //Load role & permissions
    const role = await Role.findById(user.role).populate('permissions', 'route');
    if (!role) {
      return res.status(403).json({ success: false, message: 'Role not found.' });
    }
    console.log("Role found:", role.name);

    // 2.a) Admin bypass
    if (role.name === 'Admin') {
      console.log('Admin bypass');
      return next();
    }

    if (!role.permissions.length) {
      console.log("Not run")
      return res.status(403).json({ success: false, message: 'No permissions assigned.' });
    }

    // Extract all allowed routes from role
    const allowedRoutes = role.permissions.map(p => p.route);
    console.log('Allowed routes:', allowedRoutes);

    // Normalize current request route
    const fullPath = (req.baseUrl + req.path).replace(/\/$/, '');
    console.log('Full path:', fullPath);

    // Check if user is allowed to access this path
    const isAllowed = allowedRoutes.some(route =>
      fullPath.startsWith(route.replace(/\/$/, ''))
    );

    if (isAllowed) {
      console.log('Authorized');
      return next();
    }

    //  Not authorized
    console.log('Not authorized');
    return res.status(403).json({
      success: false,
      message: 'You are not authorized for this action!'
    });

  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = authorization;
