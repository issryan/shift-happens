const express = require('express');
const { registerUser, loginUser, getAuthenticatedUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserRegistration, validate } = require('../utils/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, validate, registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getAuthenticatedUser);

module.exports = router;