const Event = require('../models/Event');

// Get events for a schedule
exports.getEventsBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const events = await Event.find({ scheduleId });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};