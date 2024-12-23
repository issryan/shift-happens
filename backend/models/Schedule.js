const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduleData: {
    type: Array,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3888000, // 45 days in seconds
  },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);