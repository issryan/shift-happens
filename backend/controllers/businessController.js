const Business = require('../models/Business');

exports.createBusiness = async (req, res) => {
  try {
    const { name, location } = req.body;
    const userId = req.user.id;

    const newBusiness = await Business.create({ userId, name, location });
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const business = await Business.findOne({ userId });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location } = req.body;

    const business = await Business.findOneAndUpdate(
      { userId },
      { name, location },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};