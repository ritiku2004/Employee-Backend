const Employee = require('../models/Employee');
const Role     = require('../models/Role');

// Create a new employee
exports.createEmployee = async (data) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    address,
    emailAddress,
    password,
    role: roleId,
  } = data;

  // Basic validation
  if (!firstName || !lastName || !mobileNumber || !address || !emailAddress || !password || !roleId) {
    throw { status: 400, message: 'All fields are required' };
  }

  // Ensure role exists
  const roleDoc = await Role.findById(roleId);
  if (!roleDoc) {
    throw { status: 400, message: 'Invalid role' };
  }

  // Check for duplicate email
  const existing = await Employee.findOne({ emailAddress });
  if (existing) {
    throw { status: 409, message: 'Email already registered' };
  }

  // Create and save employee
  const newEmp = new Employee({
    firstName,
    lastName,
    mobileNumber,
    address,
    emailAddress,
    password,
    role: roleId,
  });
  await newEmp.save();

  // Populate role for response
  await newEmp.populate('role', 'name');
  return newEmp;
};

// Get list of employees
exports.getEmployeeList = async () => {
  return Employee.find()
    .select('-password')
    .populate('role', 'name')
    .lean();
};

// Update an existing employee
exports.editEmployee = async (id, data) => {
  const updates = {};
  const fields = ['firstName', 'lastName', 'mobileNumber', 'address', 'emailAddress', 'role'];
  fields.forEach(f => {
    if (data[f] !== undefined) updates[f] = data[f];
  });
  if (data.password) {
    updates.password = data.password;
  }

  // If role changed, validate it
  if (updates.role) {
    const roleDoc = await Role.findById(updates.role);
    if (!roleDoc) {
      throw { status: 400, message: 'Invalid role ID' };
    }
  }

  const emp = await Employee.findById(id);
  if (!emp) {
    throw { status: 404, message: 'Employee not found' };
  }

  Object.assign(emp, updates);
  await emp.save();
  await emp.populate('role', 'name');

  const empObj = emp.toObject();
  delete empObj.password;
  return empObj;
};

// Delete an employee
exports.deleteEmployee = async (id) => {
  const emp = await Employee.findById(id);
  if (!emp) {
    throw { status: 404, message: 'Employee not found' };
  }
  await emp.deleteOne();
};
