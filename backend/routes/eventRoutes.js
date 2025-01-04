const express = require('express');
const {
  addOrUpdateEvent,
  deleteEvent,
  autoGenerateEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { validateEventUpdate } = require('../utils/validation');

const router = express.Router();

// Route to add or update an event
router.post('/add-or-update', protect, addOrUpdateEvent);

// Route to delete an event
router.delete('/:id',protect, deleteEvent);

// Route to auto-generate events for a schedule
router.post('/auto-generate',protect, autoGenerateEvents);

module.exports = router;