const express = require('express');
const router = express.Router();
const { getItinerary, addActivity, updateActivity, deleteActivity, updateDayTitle } = require('../controllers/itineraryController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:tripId', getItinerary);
router.post('/:dayId/activities', addActivity);
router.put('/:dayId/activities/:activityId', updateActivity);
router.delete('/:dayId/activities/:activityId', deleteActivity);
router.put('/:dayId/title', updateDayTitle);

module.exports = router;
