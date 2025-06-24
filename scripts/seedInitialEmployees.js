require('dotenv').config();
const mongoose  = require('mongoose');
const Role      = require('../models/Role');
const Employee  = require('../models/Employee');
const bcrypt    = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://ritikupadhyay838:MKNG9t8Tv8oLCQpp@cluster0.zh4dckn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function hashIfPlain(emp) {
  // Check if password is already a bcrypt hash (it usually starts with "$2")
  if (typeof emp.password === 'string' && !emp.password.startsWith('$2')) {
    const newHash = await bcrypt.hash(emp.password, 10);
    emp.password = newHash;
    await emp.save();
    console.log(`Re‐hashed existing password for ${emp.emailAddress}`);
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding…');

    // 1. Find “Admin” role and “Manager” role
    const adminRole   = await Role.findOne({ name: 'Admin' });
    const managerRole = await Role.findOne({ name: 'Manager' });

    if (!adminRole || !managerRole) {
      console.error('ERROR: You must have roles “Admin” and “Manager” in the roles collection.');
      process.exit(1);
    }

    // 2. Upsert admin employee
    const adminEmail = 'admin@gmail.com';
    let adminEmp = await Employee.findOne({ emailAddress: adminEmail });
    if (!adminEmp) {
      // Create new with hashed password
      const hashed = await bcrypt.hash('123Abc!', 10);
      adminEmp = new Employee({
        firstName:    'Super',
        lastName:     'Admin',
        mobileNumber: '9999999999',
        address:      'HQ Address',
        emailAddress: adminEmail,
        password:     '123Abc!',
        role:         adminRole._id,
      });
      await adminEmp.save();
      console.log('Created admin user →', adminEmail);
    } else {
      // Already exists: re-hash if the field was plain-text
      await hashIfPlain(adminEmp);
      console.log('Admin user already exists:', adminEmail);
    }

    // 3. Upsert manager employee
    const managerEmail = 'manager@gmail.com';
    let managerEmp = await Employee.findOne({ emailAddress: managerEmail });
    if (!managerEmp) {
      const hashed = await bcrypt.hash('123Abc!', 10);
      managerEmp = new Employee({
        firstName:    'Project',
        lastName:     'Manager',
        mobileNumber: '8888888888',
        address:      'Branch Address',
        emailAddress: managerEmail,
        password:     '123Abc!',
        role:         managerRole._id,
      });
      await managerEmp.save();
      console.log('Created manager user →', managerEmail);
    } else {
      await hashIfPlain(managerEmp);
      console.log('Manager user already exists:', managerEmail);
    }

    console.log('Seeding done. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
}

seed();
