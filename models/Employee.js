const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema(
  {
    firstName:     { type: String, required: true },
    lastName:      { type: String, required: true },
    mobileNumber:  { type: String, required: true },
    address:       { type: String, required: true },
    emailAddress:  { type: String, required: true, unique: true },
    password:      { type: String, required: true },
    role:          { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  },
  { timestamps: true }
);

// Before saving, hash the password if it was modified
EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password  = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare a plaintext password
EmployeeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);
