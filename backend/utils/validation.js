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

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};