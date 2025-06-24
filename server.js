require('dotenv').config();

const express           = require('express');
const mongoose          = require('mongoose');
const cors              = require('cors');
const jwt               = require('jsonwebtoken');

const authRoutes            = require('./routes/auth');
const sidebarmenusRoute     = require('./routes/sidebarmenus');
const employeeAuthRoutes    = require('./routes/v1/public/employeeAuth.routes');
const employeeRoutes        = require('./routes/v1/private/employee.routes');
const rolesRoute            = require('./routes/roles');
const permissionsRoute      = require('./routes/permissions');

const app = express();

app.use(cors());
app.use(express.json());

// ——— MongoDB Connection ———
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ——— Auth & API Routes ———
app.use('/api/employee/auth',    employeeAuthRoutes);
app.use('/api/employees',        employeeRoutes);
app.use('/api/auth',             authRoutes);
app.use('/api/sidebarmenus',     sidebarmenusRoute);
app.use('/api/roles',            rolesRoute);
app.use('/api/permissions',      permissionsRoute);

// ——— Start Server ———
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
