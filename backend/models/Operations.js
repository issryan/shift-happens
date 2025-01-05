const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., 'Mon', 'Tue'
  start: { type: String, default: null }, // e.g., '09:00'
  end: { type: String, default: null }, // e.g., '17:30'
  closed: { type: Boolean, default: false }, // true if the business is closed
});

const OperationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  hours: [DaySchema], // Array of operational hours
  minEmployeesPerDay: { type: Map, of: Number, required: true }, // Minimum employees per day
});

module.exports = mongoose.model('Operations', OperationsSchema);2