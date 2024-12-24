const Business = require('../models/Business');
const Operations = require('../models/Operations');

exports.createOperations = async (req, res) => {
  try {
    const { businessHours, minEmployeesPerDay } = req.body; // Use data from frontend
    const userId = req.user.id;

    // Create business if it doesn't exist
    let business = await Business.findOne({ userId });
    if (!business) {
      business = await Business.create({
        userId,
        name: 'Default Business Name', // Replace with appropriate name if available
        location: 'Default Location',
      });
    }

    // Create operations
    const newOperations = await Operations.create({
      userId,
      businessId: business._id,
      hours: businessHours,
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
    const userId = req.user.id;
    const { hours, minEmployeesPerDay } = req.body;

    const operations = await Operations.findOneAndUpdate(
      { userId },
      { hours, minEmployeesPerDay },
      { new: true }
    );
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};