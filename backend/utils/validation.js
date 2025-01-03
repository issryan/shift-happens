const { check, body, validationResult } = require('express-validator');

// Validation rules for registering a user
exports.validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for adding an employee
exports.validateEmployee = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Must be a valid email"),
  body("phone")
    .optional({ nullable: true, checkFalsy: true }) 
    .isMobilePhone()
    .withMessage("Must be a valid phone number"),
  body("availability")
    .isArray({ min: 1 })
    .withMessage("Availability must be an array with at least one entry")
    .custom((value) => {
      if (
        value.some(
          (slot) => !slot.day || !slot.start || !slot.end
        )
      ) {
        throw new Error(
          "Each availability entry must include day, start, and end times"
        );
      }
      return true;
    }),
  body("hoursRequired")
    .isInt({ min: 0 })
    .withMessage("Hours required must be a non-negative integer"),
];

//Validate schedule creation
exports.validateSchedule = [
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be a valid number between 1 and 12'),
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be a valid number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateEventUpdate = [
  body('startTime').optional().isISO8601().withMessage('Invalid start time format'),
  body('endTime').optional().isISO8601().withMessage('Invalid end time format'),
  body('details').optional().isString().withMessage('Details must be a string'),
  body('startTime')
    .custom((value, { req }) => {
      if (value && req.body.endTime && new Date(value) >= new Date(req.body.endTime)) {
        throw new Error('startTime must be before endTime');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};