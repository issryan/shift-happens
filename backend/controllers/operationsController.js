const Business = require('../models/Business');
const Operations = require('../models/Operations');

exports.createOperations = async (req, res) => {
  try {
    const { hours, minEmployeesPerDay, businessId } = req.body; 
    const userId = req.user.id;

    // Normalize the hours for days marked as closed
    hours.forEach((day) => {
      if (day.closed) {
        day.start = null;
        day.end = null;
      }
    });

    // Create the new Operations document
    const newOperations = await Operations.create({
      userId,
      businessId,
      hours,
      minEmployeesPerDay,
    });

    res.status(201).json(newOperations);
  } catch (error) {
    console.error('Error creating operations:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getOperations = async (req, res) => {
  try {
    const userId = req.user.id;
    const operations = await Operations.findOne({ userId }).populate('businessId');
    if (!operations) return res.status(404).json({ message: 'Operations not found' });
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOperations = async (req, res) => {
  try {
    const { hours, minEmployeesPerDay } = req.body;
    const { id } = req.params;

    const operations = await Operations.findById(id);
    if (!operations) return res.status(404).json({ success: false, message: 'Operations not found' });

    // Update hours
    hours.forEach((day) => {
      if (day.closed) {
        day.start = null;
        day.end = null;
      }
    });

    operations.hours = hours;
    operations.minEmployeesPerDay = minEmployeesPerDay;

    await operations.save();

    res.status(200).json({ success: true, operations });
  } catch (error) {
    console.error('Error updating operations:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};