const Operations = require('../models/Operations');

exports.createOperations = async (req, res) => {
  try {
    const { businessId, hours, minEmployeesPerDay } = req.body;
    const userId = req.user.id;

    const newOperations = await Operations.create({ userId, businessId, hours, minEmployeesPerDay });
    res.status(201).json(newOperations);
  } catch (error) {
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