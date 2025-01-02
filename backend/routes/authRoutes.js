const express = require('express');
const { registerUser, loginUser, getAuthenticatedUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateUserRegistration, validate } = require('../utils/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, validate, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getAuthenticatedUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;