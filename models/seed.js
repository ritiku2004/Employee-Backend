require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const Permission = require('./Permission.js');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/authApp';

// Define default permissions
const permissions = [
  // User management
  { permission_name: 'View Users', route: '/api/users', module_name: 'User Management', type: 'View' },
  { permission_name: 'Create Users', route: '/api/users', module_name: 'User Management', type: 'Create' },
  { permission_name: 'Edit Users', route: '/api/users', module_name: 'User Management', type: 'Edit' },
  { permission_name: 'Delete Users', route: '/api/users', module_name: 'User Management', type: 'Delete' },

  // Role management
  { permission_name: 'View Roles', route: '/api/roles', module_name: 'Role Management', type: 'View' },
  { permission_name: 'Create Roles', route: '/api/roles', module_name: 'Role Management', type: 'Create' },
  { permission_name: 'Edit Roles', route: '/api/roles', module_name: 'Role Management', type: 'Edit' },
  { permission_name: 'Delete Roles', route: '/api/roles', module_name: 'Role Management', type: 'Delete' },

  // Sidebar menu management
  { permission_name: 'View Sidebar Menus', route: '/api/sidebarmenus', module_name: 'Menu Management', type: 'View' },
  { permission_name: 'Edit Sidebar Menus', route: '/api/sidebarmenus', module_name: 'Menu Management', type: 'Edit' },

  // Example: Order management
  { permission_name: 'View Orders', route: '/api/orders', module_name: 'Order Management', type: 'View' },
  { permission_name: 'Create Orders', route: '/api/orders', module_name: 'Order Management', type: 'Create' },
  { permission_name: 'Edit Orders', route: '/api/orders', module_name: 'Order Management', type: 'Edit' },
  { permission_name: 'Delete Orders', route: '/api/orders', module_name: 'Order Management', type: 'Delete' },

  // Additional example: Pricing
  { permission_name: 'View Pricing', route: '/api/prices', module_name: 'Pricing', type: 'View' },
  { permission_name: 'Edit Pricing', route: '/api/prices', module_name: 'Pricing', type: 'Edit' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB at', MONGO_URI);

    // Clear existing permissions
    await Permission.deleteMany({});
    console.log('Cleared existing permissions');

    // Insert new permissions
    const inserted = await Permission.insertMany(permissions);
    console.log(`Inserted ${inserted.length} permissions.`);
  } catch (err) {
    console.error('Error seeding permissions:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
