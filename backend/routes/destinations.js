const express = require('express');
const router = express.Router();
const { getDestinations, getDestination, createDestination, saveDestination } = require('../controllers/destinationController');
const { protect } = require('../middleware/auth');

router.get('/', getDestinations);
router.get('/:id', getDestination);
router.post('/', protect, createDestination);
router.post('/:id/save', protect, saveDestination);

module.exports = router;
