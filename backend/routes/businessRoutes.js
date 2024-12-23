const express = require('express');
const { createBusiness, getBusiness } = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBusiness);
router.get('/', authMiddleware, getBusiness);

module.exports = router;