const express = require('express');
const { createOperations, getOperations, updateOperations } = require('../controllers/operationsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOperations);
router.get('/', authMiddleware, getOperations);
router.put('/', authMiddleware, updateOperations);

module.exports = router;