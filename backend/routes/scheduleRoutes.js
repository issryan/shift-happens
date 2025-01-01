const express = require('express');
const {
  generateSchedule,
  getSchedules,
  getScheduleById,
  deleteSchedule,
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate a new schedule
router.post('/generate', protect, generateSchedule);

// Get all schedules for the logged-in manager
router.get('/', protect, getSchedules);

// Get a specific schedule by ID
router.get('/:id', protect, getScheduleById);

// Delete a schedule by ID
router.delete('/:id', protect, deleteSchedule);

module.exports = router;