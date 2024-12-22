const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const { validateUserRegistration, validate } = require('../utils/validation');

router.post('/register', validateUserRegistration, validate, registerUser);
router.post('/login', loginUser);

module.exports = router;