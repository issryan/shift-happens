const mongoose = require('mongoose');

const OperationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  hours: {
    type: Map, // To handle per-day start and end
    of: new mongoose.Schema({
      start: { type: String, required: true },
      end: { type: String, required: true },
    }),
    required: true,
  },
  minEmployeesPerDay: {
    type: Map, // To handle per-day employee numbers
    of: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Operations', OperationsSchema);