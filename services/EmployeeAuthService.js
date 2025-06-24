const jwt      = require('jsonwebtoken');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'Secret';

exports.login = async ({ emailAddress, password, rememberMe }) => {
  if (!emailAddress || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const emp = await Employee.findOne({ emailAddress }).populate('role', 'name');
  if (!emp || !(await emp.comparePassword(password))) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const payload = {
    sub:      emp._id,
    email:    emp.emailAddress,
    roleId:   emp.role._id,
    roleName: emp.role.name
  };
  const expiresIn = rememberMe ? '7d' : '1h';
  const token     = jwt.sign(payload, "Secret", { expiresIn });

  return {
    accessToken: token,
    role: {
      id:    emp.role._id,
      name:  emp.role.name,
      email: emp.emailAddress
    },
    expiresIn
  };
};

exports.autoLogin = (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) {
    throw { status: 401, message: 'No valid token provided' };
  }
  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, "Secret", { ignoreExpiration: true });
  } catch {
    throw { status: 401, message: 'Invalid token' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw { status: 401, message: 'Token expired' };
  }

  return {
    accessToken: token,
    role: {
      id:    payload.roleId,
      name:  payload.roleName,
      email: payload.email
    }
  };
};

exports.logout = () => {
  // Stateless JWT: nothing to do server‑side
  return { message: 'Logged out' };
};
