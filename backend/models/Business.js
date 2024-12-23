const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);