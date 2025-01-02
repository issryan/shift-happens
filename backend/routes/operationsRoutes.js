const express = require('express');
const { createOperations, getOperations, updateOperations } = require('../controllers/operationsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOperations);
router.get('/', protect, getOperations);
router.put('/', protect, updateOperations);

module.exports = router;