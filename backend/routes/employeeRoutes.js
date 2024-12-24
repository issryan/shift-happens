const express = require('express');
const {
  getEmployees,
  addEmployee,
  deleteEmployee,
  getAnalytics,
  searchEmployees,
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateEmployee, validate } = require('../utils/validation');

const router = express.Router();

// Get all employees for the logged-in manager
router.get('/', authMiddleware, getEmployees);

// Get analytics for manager
router.get('/analytics', authMiddleware, getAnalytics);

// Search employees
router.get('/search', authMiddleware, searchEmployees);

// Add a new employee
router.post('/', authMiddleware, validateEmployee, validate, addEmployee);

// Delete an employee
router.delete('/:id', authMiddleware, deleteEmployee);

module.exports = router;