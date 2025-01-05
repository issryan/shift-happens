const express = require('express');
const {
  addEvent,
  updateEvent,
  deleteEvent,
  autoGenerateEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { validateEventUpdate } = require('../utils/validation');

const router = express.Router();

// Route to add
router.post('/add', protect, addEvent);

//Update an event
router.put('/update', protect, updateEvent);

// Route to delete an event
router.delete('/:id',protect, deleteEvent);

// Route to auto-generate events for a schedule
router.post('/auto-generate',protect, autoGenerateEvents);

module.exports = router;