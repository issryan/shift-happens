const express = require('express');
const {
  getEventsByScheduleId,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all events for a specific schedule
router.get('/:scheduleId', protect, getEventsByScheduleId);

// Update an event (e.g., change shift details)
router.put('/:id', protect, updateEvent);

// Delete an event
router.delete('/:id', protect, deleteEvent);

module.exports = router;