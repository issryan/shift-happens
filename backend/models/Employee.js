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
  availability: [
    {
      day: {
        type: String, // e.g., "Monday"
        required: true,
      },
      start: {
        type: String, // e.g., "09:00"
        required: true,
      },
      end: {
        type: String, // e.g., "13:00"
        required: true,
      },
    },
  ],
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