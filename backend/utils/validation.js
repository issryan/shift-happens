const { body, validationResult } = require('express-validator');

// Validation rules for registering a user
exports.validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for adding an employee
exports.validateEmployee = [
  body('name').notEmpty().withMessage('Employee name is required'),
  body('availability').isArray().withMessage('Availability must be an array of days'),
  body('hoursRequired').isNumeric().withMessage('Hours required must be a number').optional(),
];

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};