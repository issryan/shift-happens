const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
  },
  availability: {
    type: [String], 
    required: true,
  },
  hoursRequired: {
    type: Number, 
    default: 0,
  },
  timeOff: {
    type: [String], 
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);