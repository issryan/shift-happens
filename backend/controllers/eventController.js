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

//update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, details } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (details) event.details = details;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMultipleEvents = async (req, res) => {
  try {
    const { eventIds } = req.body;

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ message: 'No event IDs provided' });
    }

    await Event.deleteMany({ _id: { $in: eventIds } });
    res.status(200).json({ message: 'Events deleted successfully' });
  } catch (error) {
    console.error('Error deleting events:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};