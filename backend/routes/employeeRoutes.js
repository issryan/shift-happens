const express = require('express');
const {
  getEmployees,
  addEmployee,
  deleteEmployee,
  getAnalytics,
  searchEmployees,
  updateEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { validateEmployee, validate } = require('../utils/validation');

const router = express.Router();

// Get all employees for the logged-in manager
router.get('/', protect, getEmployees);

// Get analytics for manager
router.get('/analytics', protect, getAnalytics);

// Search employees
router.get('/search', protect, searchEmployees);

// Add a new employee
router.post('/', protect, validateEmployee, validate, addEmployee);

// Update employee details
router.put('/:id', protect, updateEmployee);

// Delete an employee
router.delete('/:id', protect, deleteEmployee);

module.exports = router;