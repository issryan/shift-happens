const mongoose = require('mongoose');

const OperationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  hours: {
    start: { type: String, required: true }, // e.g., "09:00 AM"
    end: { type: String, required: true },   // e.g., "05:00 PM"
  },
  minEmployeesPerDay: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Operations', OperationsSchema);