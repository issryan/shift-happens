const express = require('express');
const {
    generateSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
} = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Generate a schedule
router.post('/generate', authMiddleware, generateSchedule);

// Get all schedules
router.get('/', authMiddleware, getAllSchedules);

// Get a specific schedule
router.get('/:id', authMiddleware, getScheduleById);

// Update a specific schedule
router.put('/:id', authMiddleware, updateSchedule);

// Delete a schedule
router.delete('/:id', authMiddleware, deleteSchedule);

module.exports = router;