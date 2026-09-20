const express = require('express');
const router = express.Router();
const { getBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:tripId', getBudget);
router.put('/:tripId', updateBudget);

module.exports = router;
