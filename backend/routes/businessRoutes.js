const express = require('express');
const { createBusiness, getBusiness, updateBusiness } = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBusiness);
router.get('/', authMiddleware, getBusiness);
router.put('/', authMiddleware, updateBusiness);

module.exports = router;