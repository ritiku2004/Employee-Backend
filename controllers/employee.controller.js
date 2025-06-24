const employeeService = require('../services/employeeService');

exports.createEmployee = async (req, res) => {
  try {
    const newEmp = await employeeService.createEmployee(req.body);
    res.status(201).json(newEmp);
  } catch (err) {
    console.error('createEmployee error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getEmployeeList = async (req, res) => {
  try {
    const employees = await employeeService.getEmployeeList();
    res.json(employees);
  } catch (err) {
    console.error('getEmployeeList error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const empObj = await employeeService.editEmployee(req.params.id, req.body);
    res.json(empObj);
  } catch (err) {
    console.error('editEmployee error:', err);
    // Handle duplicate key error for email
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('deleteEmployee error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
