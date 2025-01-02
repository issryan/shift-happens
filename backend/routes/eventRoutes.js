const express = require('express');
const {
  getEventsBySchedule,
  updateEvent,
  deleteMultipleEvents,
  moveShift,
  addShift,
  deleteShift,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { validateEventUpdate } = require('../utils/validation');

const router = express.Router();

// Get all events for a specific schedule
router.get('/:scheduleId', protect, getEventsBySchedule);

// Update an event (e.g., change shift details)
router.put('/:id', protect, validateEventUpdate, updateEvent);

// Delete multiple events
router.delete('/batch', protect, deleteMultipleEvents);

// Move Shift
router.put('/shift/move', protect, moveShift);

// Add Shift
router.post('/shift/add', protect, addShift);

// Delete a specific shift
router.delete('/shift/:id', protect, deleteShift);

module.exports = router;