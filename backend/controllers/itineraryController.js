const Itinerary = require('../models/Itinerary');

const getItinerary = async (req, res) => {
  try {
    const days = await Itinerary.find({ tripId: req.params.tripId }).sort('day');
    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addActivity = async (req, res) => {
  try {
    const day = await Itinerary.findById(req.params.dayId);
    if (!day) return res.status(404).json({ message: 'Day not found' });
    day.activities.push(req.body);
    await day.save();
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const day = await Itinerary.findById(req.params.dayId);
    if (!day) return res.status(404).json({ message: 'Day not found' });
    const activity = day.activities.id(req.params.activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    Object.assign(activity, req.body);
    await day.save();
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const day = await Itinerary.findById(req.params.dayId);
    if (!day) return res.status(404).json({ message: 'Day not found' });
    day.activities.pull({ _id: req.params.activityId });
    await day.save();
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDayTitle = async (req, res) => {
  try {
    const day = await Itinerary.findByIdAndUpdate(req.params.dayId, { title: req.body.title }, { new: true });
    res.json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getItinerary, addActivity, updateActivity, deleteActivity, updateDayTitle };
