const express = require('express');
const { generateSchedule, getSchedules, getScheduleById, deleteSchedule, autoSchedule, checkConflicts } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');
const { validateSchedule } = require('../utils/validation');

const router = express.Router();

// Generate a new schedule
router.post('/generate', protect, validateSchedule, generateSchedule);

// Get all schedules for the logged-in manager
router.get('/', protect, getSchedules);

// Get a specific schedule by ID
router.get('/:id', protect, getScheduleById);

// Delete a schedule by ID
router.delete('/:id', protect, deleteSchedule);

// Auto-generate schedule
router.post('/auto-schedule', protect, autoSchedule);

// Check conflicts
router.post('/check-conflicts', protect, checkConflicts);

module.exports = router;