const express = require('express');
const { registerUser, loginUser, getAuthenticatedUser, updateUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserRegistration, validate } = require('../utils/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, validate, registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getAuthenticatedUser);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;