const { body, validationResult } = require('express-validator');

// Validation rules for registering a user
exports.validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for adding an employee
exports.validateEmployee = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email'),
  check('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Must be a valid phone number'),
  check('availability')
    .isArray({ min: 1 })
    .withMessage('Availability must be an array with at least one value'),
  check('hoursRequired')
    .isInt({ min: 0 })
    .withMessage('Hours required must be a positive number'),
];


// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};