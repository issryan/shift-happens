const express = require('express');
const { generateSchedule, getSchedules } = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Generate a schedule
router.post('/generate', authMiddleware, generateSchedule);

// Get all schedules
router.get('/', authMiddleware, getSchedules);

module.exports = router;