const mongoose = require('mongoose');
const SideBarMenu = require('../models/SideBarMenu');

// Replace with your own MongoDB URI
const MONGODB_URI = 'mongodb+srv://ritikupadhyay838:MKNG9t8Tv8oLCQpp@cluster0.zh4dckn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    await SideBarMenu.deleteMany({}); // Optional: clear existing data

    const sidebarData = [
      {
        title: 'Main Menu',
        type: 'menu-title',
        module_id: '1',
        module_priority: 1
      },
      {
        title: 'Dashboard',
        type: 'route',
        parent_module_id: '1',
        module_menu_priority: 1,
        iconStyle: "<i class='fa fa-home'></i>",
        to: 'dashboard'
      },
      {
        title: 'Portfolio Management',
        type: 'menu-title',
        module_id: '2',
        module_priority: 2
      },
      {
        title: 'Projects',
        type: 'collapsible',
        parent_module_id: '2',
        module_menu_priority: 1,
        iconStyle: "<i class='fa fa-folder'></i>",
        content: [
          { title: 'Add New', to: 'projects/add' },
          { title: 'List', to: 'projects/list' }
        ]
      },
      {
        title: 'Prices',
        type: 'route',
        parent_module_id: '2',
        module_menu_priority: 2,
        iconStyle: "<i class='fa fa-cogs'></i>",
        to: 'prices'
      },
      {
        title: 'Services',
        type: 'route',
        parent_module_id: '2',
        module_menu_priority: 3,
        iconStyle: "<i class='fa fa-cogs'></i>",
        to: 'services'
      },
      {
        title: 'Team Management',
        type: 'menu-title',
        module_id: '3',
        module_priority: 3
      },
      {
        title: 'Team',
        type: 'route',
        parent_module_id: '3',
        module_menu_priority: 1,
        iconStyle: "<i class='fa fa-users'></i>",
        to: 'team'
      },
      {
        title: 'Employee Management',
        type: 'menu-title',
        module_id: '4',
        module_priority: 4
      },
      {
        title: 'Employee Role',
        type: 'route',
        parent_module_id: '4',
        module_menu_priority: 1,
        iconStyle: "<i class='fa fa-user-tag'></i>",
        to: '/roles/create'
      },
      {
        title: 'Employees',
        type: 'route',
        parent_module_id: '4',
        module_menu_priority: 2,
        iconStyle: "<i class='fa fa-user-friends'></i>",
        to: 'employees'
      },
      {
        title: 'Business Settings',
        type: 'menu-title',
        module_id: '5',
        module_priority: 5
      },
      {
        title: 'Settings',
        type: 'route',
        parent_module_id: '5',
        module_menu_priority: 1,
        iconStyle: "<i class='fa fa-cog'></i>",
        to: 'settings'
      }
    ];

    await SideBarMenu.insertMany(sidebarData);
    console.log('Sidebar menu seeded successfully');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding sidebar menu:', err);
    mongoose.disconnect();
  });
